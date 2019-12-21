import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Container, Text } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';

import Tree from '../../shared/Map/Tree/Tree';
import FormInput from '../../shared/FormInput/FormInput';
import * as treeActions from '../../store/actions/tree.action';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';
import * as colors from '../../styles/colors';
import * as variables from '../../styles/variables';
import { getLatLngDeltaForDistance } from '../../utils/geo';

const renderTrees = (coordinates) =>
	(coordinates || []).map((aCoord, idx) => <Tree key={idx} coordinate={aCoord} status="healthy" />);

const centerBias = 0.000015;

const SetTreeLocationsByRandom = () => {
	const [numberOfPlants, setNumberOfPlants] = useState(0);
	const [showError, setShowError] = useState(false);

	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
	);

	const { latitude, longitude } = userLocation;
	const { trees } = newTreeGroup;

	const mapViewDistanceFromCenter = 10;
	const { latitudeDelta, longitudeDelta } = getLatLngDeltaForDistance(
		userLocation,
		mapViewDistanceFromCenter
	);

	const handleNumberOfPlantsChange = (_numberOfPlants) => {
		setNumberOfPlants(_numberOfPlants);
		const division = 360 / _numberOfPlants;
		const radius = 0.00003;
		const treeCoords = [];

		for (let i = 0; i < _numberOfPlants; i++) {
			const modifiedLng = longitude + Math.cos(division * (i + 1) * (Math.PI / 180)) * radius;
			const modifiedLat = latitude + Math.sin(division * (i + 1) * (Math.PI / 180)) * radius;
			treeCoords.push({ longitude: modifiedLng, latitude: modifiedLat });
		}

		if (_numberOfPlants > 5) {
			setShowError(true);
		} else {
			setShowError(false);
		}

		setNewTreeGroupData({ trees: treeCoords });
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
					scrollEnabled={false}
					pitchEnabled={false}
					rotateEnabled={false}
					zoomEnabled={false}
					moveOnMarkerPress={false}
				>
					{renderTrees(trees)}
				</MapView>
			</View>

			<View style={styles.formContainer}>
				<Text style={styles.formTitle}> Select Tree Locations </Text>
				<ScrollView contentContainerStyle={styles.form}>
					<Text>Number of plants:</Text>
					<FormInput
						style={styles.textInput}
						keyboardType="number-pad"
						placeholder="Enter number of plants"
						onChangeText={handleNumberOfPlantsChange}
						value={String(numberOfPlants)}
					/>
					{showError && <Text style={styles.errorText}>Please don't add more than 5.</Text>}
				</ScrollView>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapViewContainer: { height: '80%', position: 'relative' },
	mapView: { height: '100%' },
	formContainer: { height: '20%' },
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
	errorText: {
		color: colors.red,
		fontSize: variables.font.base,
	},
});

SetTreeLocationsByRandom.navigationOptions = () => ({ header: null });

export default SetTreeLocationsByRandom;
