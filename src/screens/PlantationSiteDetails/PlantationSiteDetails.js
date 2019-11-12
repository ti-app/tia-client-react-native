import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { View, Text, Container, Icon } from 'native-base';
import MapView from 'react-native-maps';

import * as plantationSiteActions from '../../store/actions/plantation-site.action';
import { selectSelectedPlantationSite } from '../../store/reducers/plantation-site.reducer';
import PlantationSite from '../../shared/Map/PlantationSite/PlantationSite';
import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import * as colors from '../../styles/colors';
import config from '../../config/common';
import { selectUserRole } from '../../store/reducers/auth.reducer';

const centerBias = 0.00015;
const PlantationSiteDetails = ({ navigation }) => {
	const selectedPlantationSite = useSelector(selectSelectedPlantationSite);
	const userRole = useSelector(selectUserRole);

	const dispatch = useDispatch();
	const deletePlantationSite = useCallback(
		(...param) => dispatch(plantationSiteActions.deletePlantationSite(...param)),
		[dispatch]
	);

	const deleteSiteConfirmed = () => {
		const siteToDelete = selectedPlantationSite;
		deletePlantationSite(siteToDelete);
	};

	const editSite = () => {
		navigation.navigate('EditPlantationSiteDetails');
	};

	const showConfirmDeleteAlert = () => {
		Alert.alert(
			'Delete Site',
			'Are you sure? All the data associated this site will be lost. You will not be able to undo this operation.',
			[
				{
					text: 'Yes, Delete',
					onPress: deleteSiteConfirmed,
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

	const getDeleteButton = () => (
		<TouchableOpacity style={styles.deleteButton} onPress={showConfirmDeleteAlert}>
			<Icon
				type="FontAwesome5"
				name="trash"
				style={{ color: colors.red.toString(), fontSize: 24 }}
			/>
		</TouchableOpacity>
	);

	const getEditButton = () => (
		<TouchableOpacity style={styles.editButton} onPress={editSite}>
			<Icon
				type="FontAwesome5"
				name="pen"
				style={{ color: colors.black.toString(), fontSize: 24 }}
			/>
		</TouchableOpacity>
	);

	const getFormattedDate = (date) => new Date(date).toDateString().substr(4, 12);

	const isModerator = () => {
		return userRole === config.roles.MODERATOR;
	};

	if (!selectedPlantationSite) {
		return <Text>Loading...</Text>;
	}

	const {
		location,
		owner,
		createdAt,
		siteDisplayName,
		numberOfPlants,
		soilQuality,
		wateringNearBy,
		type,
		photo,
	} = selectedPlantationSite;
	const { longitude, latitude } = location;
	const formattedUploadedDate = createdAt && getFormattedDate(createdAt);

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
					<PlantationSite coordinate={{ latitude, longitude }} />
				</MapView>
			</View>

			<View style={styles.heading}>
				<Text style={styles.siteName}>{siteDisplayName || 'Site name not specified'}</Text>

				<View style={styles.modifyButtonContainer}>
					{isModerator() && getEditButton()}
					{getDeleteButton()}
				</View>
			</View>

			<View style={styles.plantationSiteDetailsContainer}>
				<ScrollView contentContainerStyle={styles.plantationSiteDetails}>
					<Text style={styles.siteInfoText}>Number of plants in site: {numberOfPlants}</Text>
					{owner && owner.displayName && (
						<Text style={styles.siteInfoText}>Uploaded by : {owner.displayName}</Text>
					)}
					{formattedUploadedDate && (
						<Text style={styles.siteInfoText}>Created on {formattedUploadedDate}</Text>
					)}
					<Text style={styles.siteInfoText}>Site Type: {type}</Text>
					<Text style={styles.siteInfoText}>Soil Quality: {soilQuality}</Text>
					<Text style={[styles.siteInfoText, styles.paddingBottomTen]}>
						{wateringNearBy ? 'Watering is available nearby.' : 'Watering is not available nearby.'}
					</Text>
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
				</ScrollView>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapView: { flex: 1.0, height: '100%' },
	plantationSiteDetailsContainer: {
		flex: 1.4,
	},
	plantationSiteDetails: {
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
	siteName: {
		textAlignVertical: 'center',
		fontSize: 20,
	},
	siteInfoText: {
		fontSize: 12,
		color: colors.gray,
	},
	paddingBottomTen: {
		paddingBottom: 10,
	},
	deleteButton: {
		padding: 8,
		borderColor: 'black',
	},
	editButton: {
		padding: 8,
		borderColor: 'black',
	},
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
});

PlantationSiteDetails.navigationOptions = ({ navigation }) => {
	const header = {
		headerTitle: (
			<OptionsBar
				leftOption={{
					action: () => {
						navigation.navigate('Home');
					},
				}}
				title="Site Details"
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

export default PlantationSiteDetails;
