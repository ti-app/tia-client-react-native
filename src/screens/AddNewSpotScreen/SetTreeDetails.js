import React, { useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Container } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';

import Tree from '../../shared/Map/Tree/Tree';
import FormInput from '../../shared/FormInput/FormInput';
import SelectTreeHealth from '../../shared/SelectButtons/SelectTreeHealth/SelectTreeHealth';
import * as treeActions from '../../store/actions/tree.action';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';

const centerBias = 0.00015;

const SetTreeDetails = () => {
	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
	);

	const handlePlantType = (plantType) => {
		setNewTreeGroupData({ plantType });
	};

	const handleWaterCycleChange = (waterCycle) => {
		setNewTreeGroupData({ waterCycle });
	};

	const handleSelectedStatusChange = (selectedStatus) => {
		const healthEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (healthEntry && healthEntry[0]) {
			setNewTreeGroupData({ health: healthEntry[0] });
		}
	};

	const renderTrees = (health) => {
		const { trees } = newTreeGroup;
		return trees.map((aCoord, idx) => (
			// eslint-disable-next-line react/no-array-index-key
			<Tree key={idx} coordinate={aCoord} status={health || 'healthy'} />
		));
	};

	const { latitude, longitude } = userLocation;
	const { health } = newTreeGroup;

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
				>
					{renderTrees(health)}
				</MapView>
			</View>

			<Text style={styles.formTitle}> Add Details </Text>
			<View style={styles.formContainer}>
				<ScrollView contentContainerStyle={styles.form}>
					<FormInput
						placeholder="Plant type"
						keyboardType="default"
						onChangeText={handlePlantType}
					/>
					<FormInput
						placeholder="Water cycle"
						keyboardType="number-pad"
						onChangeText={handleWaterCycleChange}
					/>
					<View>
						<Text style={styles.paddingBottomTen}> Health of plant(s) </Text>
						<View style={styles.paddingBottomTen}>
							<SelectTreeHealth onSelectedStatusChange={handleSelectedStatusChange} />
						</View>
					</View>
				</ScrollView>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapViewContainer: { height: '55%' },
	mapView: { height: '100%' },
	formTitle: {
		fontSize: 25,
	},
	formContainer: {
		height: '45%',
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

SetTreeDetails.navigationOptions = () => ({ header: null });

export default SetTreeDetails;
