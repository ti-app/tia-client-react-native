import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Container, Button, Text } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Polyline, Circle } from 'react-native-maps';

import Tree from '../../shared/Map/Tree/Tree';
import FormInput from '../../shared/FormInput/FormInput';
import * as treeActions from '../../store/actions/tree.action';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';
import * as colors from '../../styles/colors';
import {
	calculateTreeCoordinates,
	getLatLngDeltaForDistance,
	getDistanceFromLatLon,
} from '../../utils/geo';
import SelectButton from '../../shared/SelectButton/SelectButton';
import config from '../../config/common';
import { showErrorToast } from '../../utils/predefinedToasts';

const renderTrees = (coordinates) =>
	(coordinates || []).map((aCoord, idx) => <Tree key={idx} coordinate={aCoord} status="healthy" />);

const centerBias = 0.000015;

const SetTreeLocations = () => {
	const [type, setType] = useState('spacing'); // should be one of 'spacing' or 'numberOfPlants'
	const [spacing, setSpacing] = useState(0);
	const [numberOfPlants, setNumberOfPlants] = useState(0);
	const [endpoints, setEndpoints] = useState([]);
	const [mapRef, setMapRef] = useState(null);

	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
	);

	const { latitude, longitude } = userLocation;
	const { trees } = newTreeGroup;

	const presetDistParams = { spacing: false, numberOfPlants: false };
	presetDistParams[type] = true;

	const clearanceDistance = 2; // in meters
	const mapViewDistanceFromCenter = config.maxProximityDistance + clearanceDistance;
	const { latitudeDelta, longitudeDelta } = getLatLngDeltaForDistance(
		userLocation,
		mapViewDistanceFromCenter
	);

	const handleSpacingChange = (_spacing) => {
		setSpacing(_spacing);
		const treeCoords = calculateTreeCoordinates({
			spacing: _spacing,
			numberOfPlants,
			type,
			endpoints,
		});
		setNewTreeGroupData({ trees: treeCoords });
	};

	const handleNumberOfPlantsChange = (_numberOfPlants) => {
		setNumberOfPlants(_numberOfPlants);
		const treeCoords = calculateTreeCoordinates({
			spacing,
			numberOfPlants: _numberOfPlants,
			type,
			endpoints,
		});
		setNewTreeGroupData({ trees: treeCoords });
	};

	const handleDistParamChange = (distParam) => {
		const { value } = distParam;
		setType(value);
		const treeCoords = calculateTreeCoordinates({
			spacing,
			numberOfPlants,
			type: value,
			endpoints,
		});
		setNewTreeGroupData({ trees: treeCoords });
	};

	const handleMapPress = (e) => {
		const { coordinate: newCoordinate } = e.nativeEvent;

		if (endpoints.length >= 2) {
			return;
		}

		const distanceFromCenter = getDistanceFromLatLon([userLocation, newCoordinate]);

		if (distanceFromCenter > config.maxProximityDistance) {
			showErrorToast(`You can only select a point inside ${config.maxProximityDistance} meters`);
			return;
		}

		const modifiedEndpoints = [...endpoints];

		modifiedEndpoints.push(newCoordinate);

		setNewTreeGroupData({ trees: [...modifiedEndpoints] });
		setEndpoints(modifiedEndpoints);
	};

	const getInstruction = () => {
		switch (true) {
			case !endpoints[0]:
				return '1. Tap on a map to select starting point of line.';
			case !endpoints[1]:
				return '2. Tap on a map to select ending point of line.';
			case type === 'spacing' && spacing <= 0:
				return '3. Enter spacing (more than 0) in meters or change map distribution to "Number of plants"';
			case type === 'numberOfPlants' && numberOfPlants < 2:
				return '3. Enter number of plants (more than 2) or change map distribution to "spacing"';
			case type === 'spacing' && spacing > 0:
				return '4. All set! Continue or change map distribution to "NUMBER OF PLANTS"';
			case type === 'numberOfPlants' && numberOfPlants >= 2:
				return '4. All set! Continue or change map distribution to "SPACING"';
			default:
				return '';
		}
	};

	const handleClear = () => {
		setEndpoints([]);
		setNewTreeGroupData({ trees: [] });
	};

	const handleMapRegionChange = (region) => {
		if (!mapRef) {
			return;
		}

		const {
			latitude: currentCenterLat,
			longitude: currentCenterLng,
			latitudeDelta: currentCenterLatDelta,
			longitudeDelta: currentCenterLngDelta,
		} = region;

		const topRightLat = currentCenterLat + currentCenterLatDelta;
		const topRightLng = currentCenterLng + currentCenterLngDelta;
		const bottomLeftLat = currentCenterLat - currentCenterLatDelta;
		const bottomLeftLng = currentCenterLng - currentCenterLngDelta;

		const distanceToTopRight = getDistanceFromLatLon([
			userLocation,
			{ latitude: topRightLat, longitude: topRightLng },
		]);
		const distanceToBottomLeft = getDistanceFromLatLon([
			userLocation,
			{ latitude: bottomLeftLat, longitude: bottomLeftLng },
		]);
		const distanceToCurrentCenter = getDistanceFromLatLon([
			userLocation,
			{ latitude: currentCenterLat, longitude: currentCenterLng },
		]);

		if (
			distanceToCurrentCenter > mapViewDistanceFromCenter ||
			distanceToTopRight > mapViewDistanceFromCenter ||
			distanceToBottomLeft > mapViewDistanceFromCenter
		) {
			const mapLocation = {
				latitude,
				longitude,
				latitudeDelta: Math.abs(latitudeDelta),
				longitudeDelta: Math.abs(longitudeDelta),
			};

			mapRef.animateToRegion(mapLocation, 1000);
		}
	};

	return (
		<Container style={styles.container}>
			<View style={styles.mapViewContainer}>
				<MapView
					style={styles.mapView}
					initialRegion={{
						latitude: latitude + centerBias, // Added bias for center of map to align it properly in the viewport, temporary solution. TODO: Think of better way.
						longitude,
						latitudeDelta: Math.abs(latitudeDelta),
						longitudeDelta: Math.abs(longitudeDelta),
					}}
					// scrollEnabled={false}
					// pitchEnabled={false}
					// rotateEnabled={false}
					// zoomEnabled={false}
					ref={(r) => {
						setMapRef(r);
					}}
					onRegionChangeComplete={(region) => {
						handleMapRegionChange(region);
					}}
					onPress={handleMapPress}
					moveOnMarkerPress={false}
				>
					{endpoints.length === 2 && (
						<Polyline coordinates={endpoints} strokeColor={colors.purple} strokeWidth={3} />
					)}
					<Circle
						center={{ latitude, longitude }}
						radius={config.maxProximityDistance}
						strokeWidth={1}
						strokeColor={colors.blue.toString()}
						fillColor={colors.lightGray.alpha(0.5)}
					/>
					{renderTrees(trees)}
				</MapView>
				<Text style={styles.instruction}>{getInstruction()}</Text>
				{endpoints[0] && (
					<Button danger style={styles.resetButton} onPress={handleClear}>
						<Text> RESET </Text>
					</Button>
				)}
			</View>

			<View style={styles.formContainer}>
				<Text style={styles.formTitle}> Select Tree Locations </Text>
				<ScrollView contentContainerStyle={styles.form}>
					<Text>Distribute trees along line by:</Text>
					<SelectButton
						presetData={[
							{ value: 'spacing', label: 'SPACING', selected: true },
							{ value: 'numberOfPlants', label: 'NUMBER OF PLANTS' },
						]}
						onSelectedItemChange={handleDistParamChange}
						orientation="horizontal"
						atleastOneSelected
					/>
					<Text>
						{type === 'spacing' && 'Enter spacing in meters:'}
						{type === 'numberOfPlants' && 'Enter number of plants'}
					</Text>
					{type === 'spacing' && (
						<FormInput
							style={[styles.textInput, styles.paddingBottomTen]}
							keyboardType="number-pad"
							placeholder="Enter spacing"
							onChangeText={handleSpacingChange}
							value={String(spacing)}
						/>
					)}
					{type === 'numberOfPlants' && (
						<FormInput
							style={styles.textInput}
							keyboardType="number-pad"
							placeholder="Enter number of plants"
							onChangeText={handleNumberOfPlantsChange}
							value={String(numberOfPlants)}
						/>
					)}
				</ScrollView>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapViewContainer: { height: '70%', position: 'relative' },
	instruction: {
		position: 'absolute',
		bottom: 0,
		width: '60%',
		alignSelf: 'center',
		textAlign: 'center',
		fontWeight: 'bold',
		color: colors.blue,
	},
	resetButton: {
		position: 'absolute',
		top: 90,
		right: 10,
	},
	mapView: { height: '100%' },
	formContainer: { height: '30%' },
	formTitle: {
		fontSize: 25,
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		padding: 20,
	},
	paddingBottomTen: {
		paddingBottom: 10,
	},
});

SetTreeLocations.navigationOptions = () => ({ header: null });

export default SetTreeLocations;
