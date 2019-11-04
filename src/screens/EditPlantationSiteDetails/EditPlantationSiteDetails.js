import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	StyleSheet,
	Keyboard,
	ScrollView,
	TouchableOpacity,
	CheckBox,
	Platform,
	ImageBackground,
} from 'react-native';
import { Container, View, Text, Button } from 'native-base';
import MapView from 'react-native-maps';
import { RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import PlantationSite from '../../shared/Map/PlantationSite/PlantationSite';
import FormInput from '../../shared/FormInput/FormInput';
import SelectSoilQuality from '../../shared/SelectButtons/SelectSoilQuality/SelectSoilQuality';
import SelectPropertyType from '../../shared/SelectButtons/SelectPropertyType/SelectPropertyType';
import * as locationActions from '../../store/actions/location.action';
import * as plantationSiteActions from '../../store/actions/plantation-site.action';
import * as colors from '../../styles/colors';
import { selectSelectedPlantationSite } from '../../store/reducers/plantation-site.reducer';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { useKeyboardHideHook } from '../../utils/customHooks';

const centerBias = 0.00015;

const EditPlantationSiteScreen = () => {
	const [id, setId] = useState(null);
	const [siteDisplayName, setSiteDisplayName] = useState('');
	const [type, setType] = useState('public');
	const [wateringNearBy, setWateringNearby] = useState(false);
	const [soilQuality, setSoilQuality] = useState('good');
	const [numberOfPlants, setNumOfPlants] = useState(0);
	const [currentLocation, setCurrentLocation] = useState({});
	const [updatedLocation, setUpdatedLocation] = useState({});
	const [photoURL, setPhotoURL] = useState(null);
	const [changeSiteLocation, setChangeSiteLocation] = useState(false);

	const [isKeyboardOpen] = useKeyboardHideHook(false);

	const selectedPlantationSite = useSelector(selectSelectedPlantationSite);
	const userLocation = useSelector(selectUserLocation);

	const dispatch = useDispatch();
	const updatePlantationSite = useCallback(
		(...param) => dispatch(plantationSiteActions.updatePlantationSite(...param)),
		[dispatch]
	);
	const fetchUserLocation = useCallback(() => dispatch(locationActions.fetchUserLocation()), [
		dispatch,
	]);

	useEffect(() => {
		const {
			wateringNearBy: _wateringNearBy,
			soilQuality: _soilQuality,
			numberOfPlants: _numberOfPlants,
			location: _location,
			type: _type,
			siteDisplayName: _siteDisplayName,
			id: _id,
			photo: _photoURL,
		} = selectedPlantationSite;
		setId(_id);
		setSoilQuality(_soilQuality);
		setNumOfPlants(_numberOfPlants);
		setCurrentLocation(_location);
		setUpdatedLocation(_location);
		setType(_type);
		setSiteDisplayName(_siteDisplayName);
		setPhotoURL(_photoURL);
		setWateringNearby(_wateringNearBy === 'true');
	}, [selectedPlantationSite]);

	useEffect(() => {
		fetchUserLocation();
	}, []);

	const takePhoto = async () => {
		const result = await request(PERMISSIONS.ANDROID.CAMERA);

		if (result === RESULTS.GRANTED) {
			const pickerResult = await ImagePicker.openCamera({ compressImageQuality: 0.75 });
			setPhotoURL(pickerResult.path);
		}
	};

	const handlePlantLocationChange = () => {
		if (!changeSiteLocation) {
			// Change plant location
			const { latitude, longitude } = userLocation;
			setUpdatedLocation({ longitude, latitude });
		} else {
			// Reset plant location
			setUpdatedLocation(currentLocation);
		}
		setChangeSiteLocation((_changeSiteLocation) => !_changeSiteLocation);
	};

	const handleSiteNameChange = (_siteDisplayName) => {
		setSiteDisplayName(_siteDisplayName);
	};

	const handleNumberOfPlantsChange = (_numberOfPlants) => {
		setNumOfPlants(_numberOfPlants);
	};

	// TODO: Check Api for location and update following method to support updated location
	// FIXME: It's sending photo value as null. Use updated photo logic as implemeneted in edit tree details page
	const handleUpdateSite = () => {
		const formData = createFormData(null, {
			siteDisplayName,
			numberOfPlants,
			type,
			wateringNearBy,
			soilQuality,
		});

		updatePlantationSite(id, formData);
	};

	const createFormData = (uri, body) => {
		const data = new FormData();
		if (uri) {
			const filename = uri.split('/').pop();
			const type = filename.split('.').pop();

			data.append('photo', {
				uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
				type: `image/${type}`,
				name: filename,
			});
		}

		Object.keys(body).forEach((key) => {
			data.append(key, body[key]);
		});

		return data;
	};

	const handleOnWateringNearbyChange = () => {
		setWateringNearby((_wateringNearBy) => !_wateringNearBy);
	};

	const handleSoilQualityChange = (selectedStatus) => {
		const soilQualityEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (soilQualityEntry && soilQualityEntry[0]) {
			setSoilQuality(soilQualityEntry[0]);
		}
	};

	const handlePropertyTypeChange = (selectedStatus) => {
		const typeEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (typeEntry && typeEntry[0]) {
			if (typeEntry[0] === 'publicProperty') {
				setType('public');
			}
			if (typeEntry[0] === 'privateProperty') {
				setType('private');
			}
		}
	};

	const { longitude, latitude } = updatedLocation;

	const presetSoilQuality = { good: false, bad: false };
	presetSoilQuality[soilQuality] = true;

	const presetType = { publicProperty: false, privateProppublicProperty: false };
	presetType[type === 'public' ? 'publicProperty' : 'privateProperty'] = true;

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

			<Text style={styles.whereIsItText}> Where is it?</Text>
			<View style={styles.formContainer}>
				<ScrollView contentContainerStyle={styles.form}>
					<TouchableOpacity
						style={[styles.updatePlantLocation, styles.paddingBottomTen]}
						onPress={handlePlantLocationChange}
					>
						<View style={styles.updatePlantLocationCheckBox}>
							<CheckBox value={changeSiteLocation} />
						</View>
						<Text style={styles.updatePlantLocationText}>
							Update site location to my current location
						</Text>
					</TouchableOpacity>

					<FormInput
						placeholder="Site name"
						value={siteDisplayName}
						onChangeText={handleSiteNameChange}
					/>

					<FormInput
						placeholder="No. of plants in site?"
						keyboardType="number-pad"
						value={numberOfPlants}
						onChangeText={handleNumberOfPlantsChange}
					/>

					<TouchableOpacity
						style={[styles.wateringNearBy, styles.paddingBottomTen]}
						onPress={handleOnWateringNearbyChange}
					>
						<View style={styles.wateringNearByCheckBox}>
							<CheckBox
								color={colors.green}
								value={wateringNearBy}
								onValueChange={handleOnWateringNearbyChange}
							/>
						</View>
						<Text style={styles.wateringNearbyText}> Is Watering Available Nearby? </Text>
					</TouchableOpacity>

					<View style={styles.paddingBottomTen}>
						<Text style={styles.paddingBottomTen}> Soil Quality </Text>
						<SelectSoilQuality
							presetSoilQuality={presetSoilQuality}
							onSelectedSoilQualityChange={handleSoilQualityChange}
						/>
					</View>

					<View style={styles.paddingBottomTen}>
						<Text style={styles.paddingBottomTen}> Property Type </Text>
						<SelectPropertyType
							presetType={presetType}
							onSelectedPropertyTypeChange={handlePropertyTypeChange}
						/>
					</View>

					{photoURL && photoURL.length > 0 ? (
						<TouchableOpacity onPress={takePhoto}>
							<ImageBackground
								source={{
									uri: photoURL,
								}}
								resizeMode="contain"
								style={styles.updateImage}
							>
								<Text style={styles.updateImageText}> Click to{'\n'}update photo</Text>
							</ImageBackground>
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.addImage} onPress={takePhoto}>
							<Text style={styles.addImageText}>Add photo</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>

			{!isKeyboardOpen ? (
				<View style={styles.updateButtonContainer}>
					<Button style={[styles.updateButton]} success onPress={handleUpdateSite}>
						<Text> UPDATE </Text>
					</Button>
				</View>
			) : null}
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapView: { flex: 1 },
	whereIsItText: {
		fontSize: 25,
	},
	formContainer: {
		flex: 2,
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		padding: 20,
		justifyContent: 'space-between',
	},
	wateringNearBy: {
		display: 'flex',
		flexDirection: 'row',
		paddingTop: 10,
	},
	wateringNearByCheckBox: {
		paddingRight: 10,
	},
	wateringNearbyText: {
		textAlignVertical: 'center',
	},
	paddingBottomTen: {
		paddingBottom: 10,
	},
	updatePlantLocation: {
		display: 'flex',
		flexDirection: 'row',
		paddingTop: 10,
	},
	updatePlantLocationCheckBox: {
		paddingRight: 10,
	},
	updatePlantLocationText: { textAlignVertical: 'center' },
	updateImage: {
		width: '100%',
		height: 150,
		textAlign: 'center',
		textAlignVertical: 'center',
		marginBottom: 40,
	},
	addImage: {
		width: '100%',
		height: 150,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: colors.lightGray,
		marginBottom: 40,
	},
	addImageText: { textAlign: 'center' },
	updateImageText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		height: '100%',
		fontSize: 18,
		color: colors.gray,
	},
	updateButtonContainer: {
		position: 'absolute',
		left: 10,
		right: 10,
		bottom: 10,
		backgroundColor: 'white',
	},
	updateButton: { justifyContent: 'center', width: '100%' },
	updateButtonDisabled: { opacity: 0.4 },
	updateButtonEnabled: { opacity: 1 },
});

EditPlantationSiteScreen.navigationOptions = ({ navigation }) => {
	const header = navigation.getParam('header', {
		headerTitle: (
			<OptionsBar
				title="Edit a site"
				leftOption={{
					label: 'Cancel',
					action: () => navigation.navigate('Home'),
				}}
			/>
		),
		headerTransparent: true,
		headerStyle: {
			height: 80,
			backgroundColor: colors.white,
			opacity: 0.8,
		},
		headerLeft: null,
	});
	return header;
};

export default EditPlantationSiteScreen;
