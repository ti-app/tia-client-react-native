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
import { getLatLngDeltaForDistance } from '../../utils/geo';
import config from '../../config/common';

const renderTrees = (coordinates) =>
	(coordinates || []).map((aCoord, idx) => <Tree key={idx} coordinate={aCoord} status="healthy" />);

const centerBias = 0.000015;

const SetTreeLocationsByRandom = () => {
	const [numberOfPlants, setNumberOfPlants] = useState(0);

	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
	);

	const { latitude, longitude } = userLocation;
	const { trees } = newTreeGroup;

	const clearanceDistance = 2; // in meters
	const mapViewDistanceFromCenter = config.maxProximityDistance + clearanceDistance;
	const { latitudeDelta, longitudeDelta } = getLatLngDeltaForDistance(
		userLocation,
		mapViewDistanceFromCenter
	);

	const handleNumberOfPlantsChange = (_numberOfPlants) => {
		setNumberOfPlants(_numberOfPlants);
		const treeCoords = [];
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
					<FormInput
						style={styles.textInput}
						keyboardType="number-pad"
						placeholder="Enter number of plants"
						onChangeText={handleNumberOfPlantsChange}
						value={String(numberOfPlants)}
					/>
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

SetTreeLocationsByRandom.navigationOptions = () => ({ header: null });

export default SetTreeLocationsByRandom;
