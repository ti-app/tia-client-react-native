import React, { useCallback } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View, Text, Container } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';

import Tree from '../../shared/Map/Tree/Tree';
import FormInput from '../../shared/FormInput/FormInput';
import * as treeActions from '../../store/actions/tree.action';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';
import SelectButton from '../../shared/SelectButton/SelectButton';

const centerBias = 0.00015;

const SetTreeDetails = () => {
	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
	);

	const { waterCycle, plantType } = newTreeGroup;

	const handlePlantType = (_plantType) => {
		setNewTreeGroupData({ plantType: _plantType });
	};

	const handleWaterCycleChange = (_waterCycle) => {
		if (_waterCycle > 7) {
			Alert.alert('Invalid Entry', 'Maximum number of days for water cycle is 7.', [
				{ text: 'OK' },
			]);
			setNewTreeGroupData({ waterCycle });
		} else {
			setNewTreeGroupData({ waterCycle: _waterCycle });
		}
	};

	const handleSelectedStatusChange = (status) => {
		const { value } = status;
		setNewTreeGroupData({ health: value });
	};

	const renderTrees = (health) => {
		const { trees } = newTreeGroup;
		return trees.map((aCoord, idx) => (
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
						info="Specify plant type sucs as Neem, Mango etc."
						maxLength={20}
						value={String(plantType)}
					/>

					<FormInput
						placeholder="Water cycle"
						keyboardType="number-pad"
						maxLength={1}
						value={String(waterCycle)}
						onChangeText={handleWaterCycleChange}
						info="This field specifies the cycle of days the plant should be watered regularly."
					/>
					<View>
						<Text style={styles.paddingBottomTen}> Health of plant(s) </Text>
						<View style={styles.paddingBottomTen}>
							{/* <SelectTreeHealth onSelectedStatusChange={handleSelectedStatusChange} /> */}
							<SelectButton
								presetData={[
									{ value: 'healthy', label: 'HEALTHY', status: 'success' },
									{ value: 'weak', label: 'WEAK', status: 'warning' },
									{ value: 'almostDead', label: 'ALMOST DEAD', status: 'danger' },
								]}
								onSelectedItemChange={handleSelectedStatusChange}
								equallySpaced={false}
							/>
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
