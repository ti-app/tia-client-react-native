import React, { useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Container } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';

import { selectUserLocation } from '../../store/reducers/location.reducer';
import Tree from '../../shared/Map/Tree/Tree';
import * as treeActions from '../../store/actions/tree.action';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';
import Spot from '../../shared/Map/Spot/Spot';
import constants from '../../config/common';
import SelectButton from '../../shared/SelectButton/SelectButton';

const { distributions } = constants;

const centerBias = 0.00015;
const SetTreeDistributions = () => {
	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
	);

	useEffect(() => {
		const { latitude, longitude } = userLocation;
		setNewTreeGroupData({ trees: [{ latitude, longitude }] });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userLocation]);

	const handleDistributionChange = (distribution) => {
		const { value } = distribution;

		console.log(value);
		switch (value) {
			case distributions.SINGLE:
				const { latitude, longitude } = userLocation;
				setNewTreeGroupData({
					trees: [{ latitude, longitude }],
					distribution: distributions.SINGLE,
				});
				break;
			default:
				setNewTreeGroupData({ trees: [], distribution: value });
		}
	};

	const { distribution } = newTreeGroup;
	const { latitude, longitude } = userLocation;

	const presetDistribution = { single: false, line: false };
	presetDistribution[distribution] = true;

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
					{distribution === 'single' && (
						<Tree coordinate={{ latitude, longitude }} status="healthy" />
					)}
					{distribution === 'line' && (
						<Spot coordinate={{ latitude, longitude }} health="healthy" treeCount="?" />
					)}
				</MapView>
			</View>
			<View style={styles.formContainer}>
				<Text style={styles.formTitle}> Select Distribution</Text>
				<ScrollView contentContainerStyle={styles.form}>
					<View style={styles.paddingBottomTen}>
						<SelectButton
							presetData={[
								{ selected: true, value: distributions.SINGLE, label: 'SINGLE' },
								{ value: distributions.LINE, label: 'LINE' },
								{ value: distributions.RANDOM, label: 'NOT SURE' },
							]}
							onSelectedItemChange={handleDistributionChange}
							orientation="vertical"
						/>
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
	mapViewContainer: { height: '70%' },
	mapView: { height: '100%' },
	formTitle: {
		fontSize: 25,
	},
	formContainer: {
		height: '30%',
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

SetTreeDistributions.navigationOptions = () => ({ header: null });

export default SetTreeDistributions;
