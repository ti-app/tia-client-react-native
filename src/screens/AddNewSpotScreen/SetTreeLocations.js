import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Container, Button, Text } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Polyline } from 'react-native-maps';

import SelectLineDistParam from '../../shared/SelectButtons/SelectLineDistParam/SelectLineDistParam';
import Tree from '../../shared/Map/Tree/Tree';
import FormInput from '../../shared/FormInput/FormInput';
import * as treeActions from '../../store/actions/tree.action';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';
import * as colors from '../../styles/colors';
import { calculateTreeCoordinates } from '../../utils/geo';

const renderTrees = (coordinates) =>
	// eslint-disable-next-line react/no-array-index-key
	(coordinates || []).map((aCoord, idx) => <Tree key={idx} coordinate={aCoord} status="healthy" />);

const centerBias = 0.00015;

const SetTreeLocations = () => {
	const [type, setType] = useState('spacing'); // should be one of 'spacing' or 'numberOfPlants'
	const [spacing, setSpacing] = useState(0);
	const [numberOfPlants, setNumberOfPlants] = useState(0);
	const [endpoints, setEndpoints] = useState([]);

	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
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

	const handleDistParamChange = (_type) => {
		const typeEntry = Object.entries(_type).find((_) => _[1] === true);
		if (typeEntry && typeEntry[0]) {
			setType(typeEntry[0]);
			const treeCoords = calculateTreeCoordinates({
				spacing,
				numberOfPlants,
				type: typeEntry[0],
				endpoints,
			});
			setNewTreeGroupData({ trees: treeCoords });
		}
	};

	const handleMapPress = (e) => {
		const { coordinate: newCoordinate } = e.nativeEvent;

		if (endpoints.length >= 2) return;

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

	const { latitude, longitude } = userLocation;
	const { trees } = newTreeGroup;

	const presetDistParams = { spacing: false, numberOfPlants: false };
	presetDistParams[type] = true;

	return (
		<Container style={styles.container}>
			<View style={styles.mapViewContainer}>
				<MapView
					style={styles.mapView}
					initialRegion={{
						latitude: latitude + centerBias, // Added bias for center of map to align it properly in the viewport, temporary solution. TODO: Think of better way.
						longitude,
						latitudeDelta: 0.000882007226706992,
						longitudeDelta: 0.000752057826519012,
					}}
					scrollEnabled={false}
					pitchEnabled={false}
					rotateEnabled={false}
					zoomEnabled={false}
					onPress={handleMapPress}
					moveOnMarkerPress={false}
				>
					{endpoints.length === 2 && (
						<Polyline coordinates={endpoints} strokeColor={colors.purple} strokeWidth={3} />
					)}
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
					<SelectLineDistParam
						presetDistParams={presetDistParams}
						onSelectedDistParamChange={handleDistParamChange}
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
