import React, { useState, useCallback, useEffect } from 'react';
import {
	StyleSheet,
	Keyboard,
	ScrollView,
	TouchableOpacity,
	CheckBox,
	Image,
	Platform,
} from 'react-native';
import { Container, View, Text, Button } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import { RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import PlantationSite from '../../shared/Map/PlantationSite/PlantationSite';
import FormInput from '../../shared/FormInput/FormInput';
import SelectSoilQuality from '../../shared/SelectButtons/SelectSoilQuality/SelectSoilQuality';
import SelectPropertyType from '../../shared/SelectButtons/SelectPropertyType/SelectPropertyType';
import * as plantationSiteActions from '../../store/actions/plantation-site.action';
import * as locationActions from '../../store/actions/location.action';
import * as colors from '../../styles/colors';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { useKeyboardHideHook } from '../../utils/customHooks';

const centerBias = 0.00015;
const AddPlantationSiteScreen = () => {
	const [photo, setPhoto] = useState(null);
	const [siteDisplayName, setSiteDisplayName] = useState('');
	const [type, setType] = useState(null);
	const [wateringNearBy, setWateringNearBy] = useState(false);
	const [soilQuality, setSoilQuality] = useState(null);
	const [plants, setPlants] = useState(0);
	const [isKeyboardOpen] = useKeyboardHideHook();

	const userLocation = useSelector(selectUserLocation);

	const dispatch = useDispatch();
	const addPlantationSite = useCallback(
		(flag) => dispatch(plantationSiteActions.addPlantationSite(flag)),
		[dispatch]
	);
	const fetchUserLocation = useCallback(() => dispatch(locationActions.fetchUserLocation()), [
		dispatch,
	]);

	useEffect(() => {
		fetchUserLocation();
	}, []);

	const takePhoto = async () => {
		const result = await request(PERMISSIONS.ANDROID.CAMERA);

		if (result === RESULTS.GRANTED) {
			const pickerResult = await ImagePicker.openCamera({ compressImageQuality: 0.75 });
			setPhoto(pickerResult.path);
		}
	};

	const handleSiteNameChange = (siteDisplayName) => {
		setSiteDisplayName(siteDisplayName);
	};

	const handleNumberOfPlantsChange = (numberOfPlants) => {
		setPlants(numberOfPlants);
	};

	const handleAddSite = () => {
		const { latitude, longitude } = userLocation;

		const formData = createFormData(photo, {
			siteDisplayName,
			numberOfPlants: plants,
			lat: latitude,
			lng: longitude,
			type,
			wateringNearBy,
			soilQuality,
		});

		addPlantationSite(formData);
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
		setWateringNearBy((watering) => !watering);
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

	const isAddButtonDisabled = () => {
		return !(plants && soilQuality && type && siteDisplayName);
	};

	const { latitude, longitude } = userLocation;

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
					<FormInput placeholder="Site name" onChangeText={handleSiteNameChange} />
					<FormInput
						placeholder="No. of plants in site?"
						keyboardType="number-pad"
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
						<SelectSoilQuality onSelectedSoilQualityChange={handleSoilQualityChange} />
					</View>

					<View style={styles.paddingBottomTen}>
						<Text style={styles.paddingBottomTen}> Property Type </Text>
						<SelectPropertyType onSelectedPropertyTypeChange={handlePropertyTypeChange} />
					</View>

					{photo ? (
						<Image source={{ uri: photo }} resizeMode="contain" style={styles.image} />
					) : (
						<TouchableOpacity style={styles.imageUploadContainer} onPress={takePhoto}>
							<Text> Take a photo</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>

			{!isKeyboardOpen ? (
				<View style={styles.addButtonContainer}>
					<Button
						style={[
							styles.addButton,
							isAddButtonDisabled() ? styles.addButtonDisabled : styles.addButtonEnabled,
						]}
						disabled={isAddButtonDisabled()}
						success
						onPress={handleAddSite}
					>
						<Text> ADD </Text>
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
	imageUploadContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 150,
		backgroundColor: 'lightgray',
		marginBottom: 40,
	},
	image: {
		width: '100%',
		height: 150,
		marginBottom: 40,
	},
	addButtonContainer: {
		position: 'absolute',
		left: 10,
		right: 10,
		bottom: 10,
		backgroundColor: 'white',
	},
	addButton: { justifyContent: 'center', width: '100%' },
	addButtonDisabled: { opacity: 0.4 },
	addButtonEnabled: { opacity: 1 },
});

AddPlantationSiteScreen.navigationOptions = ({ navigation }) => {
	const header = navigation.getParam('header', {
		headerTitle: (
			<OptionsBar
				title="Add a site"
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

export default AddPlantationSiteScreen;
