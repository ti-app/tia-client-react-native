import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { View, Text, Container, Button, Icon } from 'native-base';
import MapView from 'react-native-maps';

import Tree from '../../shared/Map/Tree/Tree';
import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import * as colors from '../../styles/colors';
import config from '../../config/common';
import * as treeActions from '../../store/actions/tree.action';
import { selectSelectedTree } from '../../store/reducers/tree.reducer';
import { selectUserRole } from '../../store/reducers/auth.reducer';

const centerBias = 0.00015;

const TreeDetails = ({ navigation }) => {
	const selectedTree = useSelector(selectSelectedTree);
	const userRole = useSelector(selectUserRole);

	const dispatch = useDispatch();
	const waterTree = useCallback((...param) => dispatch(treeActions.waterTree(...param)), [
		dispatch,
	]);
	const deleteTree = useCallback((...param) => dispatch(treeActions.deleteTree(...param)), [
		dispatch,
	]);

	const renderWeekStatus = (weekStatus) => (
		<View style={styles.weekStatus}>
			{weekStatus.map((aWeek) => (
				<View key={aWeek.key} style={{ ...styles.weekDot, ...styles[aWeek.status] }} />
			))}
		</View>
	);

	const handleWaterTree = () => {
		const treeWatered = selectedTree;
		waterTree(treeWatered);
	};

	const deletePlantConfirmed = () => {
		const treeToDelete = selectedTree;
		deleteTree(treeToDelete);
	};

	const editTree = () => {
		navigation.navigate('EditTree');
	};

	const showConfirmDeleteAlert = () => {
		// Works on both iOS and Android
		Alert.alert(
			'Delete Plant',
			'Are you sure? All the data associated this plant will be lost. You will not be able to undo this operation.',
			[
				{
					text: 'Yes, Delete',
					onPress: deletePlantConfirmed,
					style: 'destructive',
				},
				{
					text: 'Cancel',
					onPress: () => {
						/** NOOP */
					},
					style: 'cancel',
				},
			],
			{ cancelable: false }
		);
	};

	const getActivityButton = () => (
		<TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('TreeActivity')}>
			<Icon
				type="Feather"
				name="activity"
				style={{ color: colors.black.toString(), fontSize: 24 }}
			/>
		</TouchableOpacity>
	);

	const getDeleteButton = () => (
		<TouchableOpacity style={styles.deleteButton} onPress={showConfirmDeleteAlert}>
			<Icon
				type="MaterialIcons"
				name="delete"
				style={{ color: colors.red.toString(), fontSize: 24 }}
			/>
		</TouchableOpacity>
	);

	const getEditButton = () => (
		<TouchableOpacity style={styles.editButton} onPress={editTree}>
			<Icon
				type="MaterialIcons"
				name="edit"
				style={{ color: colors.black.toString(), fontSize: 24 }}
			/>
		</TouchableOpacity>
	);

	const getFormattedDate = (date) => new Date(date).toDateString().substr(4, 12);

	const isModerator = () => {
		return userRole === config.roles.MODERATOR;
	};

	if (!selectedTree) {
		return <Text>Loading...</Text>;
	}

	const {
		health,
		location,
		lastActivityDate,
		owner,
		uploadedDate,
		plantType,
		photo,
	} = selectedTree;
	const { coordinates } = location;
	const [longitude, latitude] = coordinates;
	const formattedLastActivityDate = lastActivityDate && getFormattedDate(lastActivityDate);
	const formattedUploadedDate = uploadedDate && getFormattedDate(uploadedDate);
	// TODO: Change following with the proper implementation.
	const wateredPlant = Math.floor(Math.random() * 20);

	return (
		<Container style={styles.container}>
			<View style={styles.mapView}>
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
					<Tree coordinate={{ latitude, longitude }} status={health || 'healthy'} />
				</MapView>
			</View>

			<View style={styles.heading}>
				<Text style={styles.plantType}>{plantType || 'Plant type not specified'}</Text>

				<View style={styles.modifyButtonContainer}>
					{getActivityButton()}
					{isModerator() && getEditButton()}
					{getDeleteButton()}
				</View>
			</View>

			<View style={styles.treeDetailsContainer}>
				<ScrollView contentContainerStyle={styles.treeDetails}>
					{owner && owner.displayName && (
						<Text style={styles.distanceLabel}>Uploaded by : {owner.displayName}</Text>
					)}
					{formattedUploadedDate && (
						<Text style={styles.distanceLabel}>Created on {formattedUploadedDate}</Text>
					)}
					<View>
						{renderWeekStatus([
							{ key: 1, status: 'healthy' },
							{ key: 2, status: 'weak' },
							{ key: 3, status: 'weak' },
							{ key: 4, status: 'healthy' },
							{ key: 5, status: 'healthy' },
							{ key: 6, status: 'weak' },
							{ key: 7, status: 'weak' },
						])}
						<Text style={styles.lastWateredText}>
							Last watered on {formattedLastActivityDate}. Please don&apos;t forget to water me.
						</Text>
					</View>
					{photo && photo.length > 0 ? (
						<Image
							source={{
								uri: photo,
							}}
							resizeMode="contain"
							style={styles.image}
						/>
					) : (
						<View style={styles.imageNotFound}>
							<Text style={styles.imageNotFoundText}>No Image.</Text>
						</View>
					)}
					<Text style={styles.moreWateredHereText}>{wateredPlant} more have watered here</Text>
				</ScrollView>
			</View>
			<View style={styles.waterButtonContainer}>
				<Button
					style={{
						...styles.waterButton,
					}}
					success
					onPress={handleWaterTree}
				>
					<Text style={styles.waterButtonText}>WATERED</Text>
				</Button>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapView: { flex: 1.0, height: '100%' },
	treeDetailsContainer: {
		flex: 1.4,
	},
	treeDetails: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingRight: 16,
		paddingLeft: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
	heading: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: 16,
		paddingLeft: 16,
	},
	modifyButtonContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	plantType: {
		textAlignVertical: 'center',
		fontSize: 20,
	},
	addressLabel: { fontSize: 20, paddingRight: 8 },
	distanceLabel: {
		fontSize: 12,
		color: colors.gray,
	},
	weekStatus: { display: 'flex', flexDirection: 'row' },
	weekDot: { marginRight: 4, width: 12, height: 12, borderRadius: 6 },
	healthy: { backgroundColor: colors.green },
	adequate: { backgroundColor: colors.linkBlue },
	average: { backgroundColor: colors.yellow },
	weak: { backgroundColor: colors.orange },
	almostDead: { backgroundColor: colors.red },
	lastWateredText: { fontSize: 12, color: colors.gray },
	waterButtonContainer: {
		position: 'absolute',
		left: 10,
		right: 10,
		bottom: 10,
		backgroundColor: 'white',
	},
	waterButton: {
		justifyContent: 'center',
		width: '100%',
	},
	deleteButton: {
		padding: 8,
		borderColor: 'black',
	},
	editButton: {
		padding: 8,
		borderColor: 'black',
	},
	waterButtonText: { textAlign: 'center' },
	image: { width: '100%', height: 200 },
	imageNotFound: {
		width: '100%',
		height: 200,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: colors.lightGray,
	},
	imageNotFoundText: { textAlign: 'center' },
	moreWateredHereText: { marginBottom: 40 },
});

TreeDetails.navigationOptions = ({ navigation }) => {
	const header = {
		headerTitle: (
			<OptionsBar
				leftOption={{
					action: () => {
						navigation.goBack();
					},
				}}
				title="Tree Details"
			/>
		),
		headerTransparent: true,
		headerStyle: {
			backgroundColor: colors.white,
			opacity: 0.8,
		},
		headerLeft: null,
	};
	return header;
};

export default TreeDetails;
