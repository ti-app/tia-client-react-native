import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Container, View, Text, Button, Textarea } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import { RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import AutoCompleteSearch from '../../shared/AutoCompleteSearch/AutoCompleteSearch';
import SelectButton from '../../shared/SelectButton/SelectButton';
import * as locationActions from '../../store/actions/location.action';
import * as panicActions from '../../store/actions/panic.action';
import * as colors from '../../styles/colors';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { createFormData } from '../../utils/misc';
import { useKeyboardHideHook } from '../../utils/customHooks';
import PanicMarker from '../../shared/Map/PanicMarker/PanicMarker';
import { isDistanceLessThan } from '../../utils/geo';
import { showErrorToast } from '../../utils/predefinedToasts';
import config from '../../config/common';
import FormInput from '../../shared/FormInput/FormInput';

const centerBias = 0.00015;

const CreatePanicScreen = () => {
	const [photo, setPhoto] = useState(null);
	const [mapRef, setMapRef] = useState(null);
	const [panicSiteName, setPanicSiteName] = useState('');
	const [type, setType] = useState('fire');
	const [googlePlaceId, setGooglePlaceId] = useState(null);
	const [description, setDescription] = useState('');
	const [panicLocation, setPanicLocation] = useState('');
	const [numOfPlantsAffected, setNumberOfPlantsAffected] = useState(null);
	const [searchedLocations, setSearchedLocations] = useState([]);
	const [isKeyboardOpen] = useKeyboardHideHook();

	const userLocation = useSelector(selectUserLocation);

	const dispatch = useDispatch();
	const createPanic = useCallback((...param) => dispatch(panicActions.createPanic(...param)), [
		dispatch,
	]);
	const fetchUserLocation = useCallback(() => dispatch(locationActions.fetchUserLocation()), [
		dispatch,
	]);

	useEffect(() => {
		fetchUserLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	setPanicLocation(userLocation);
	// }, [userLocation]);

	const takePhoto = async () => {
		const result = await request(PERMISSIONS.ANDROID.CAMERA);

		if (result === RESULTS.GRANTED) {
			const pickerResult = await ImagePicker.openCamera({ compressImageQuality: 0.75 });
			setPhoto(pickerResult.path);
		}
	};

	const handleCreatePanic = () => {
		const { latitude, longitude } = panicLocation;

		const formData = createFormData(
			{
				lat: latitude,
				lng: longitude,
				panicType: type,
				googlePlaceId,
				description,
				googlePlaceName: panicSiteName,
				numberOfPlants: numOfPlantsAffected,
			},
			photo
		);

		createPanic(formData);
	};

	const goToMapLocation = (location) => {
		if (mapRef) {
			const { latitude, longitude } = location;
			const mapLocation = {
				latitude: latitude + centerBias,
				longitude,
				latitudeDelta: 0.000882007226706992,
				longitudeDelta: 0.000752057826519012,
			};

			mapRef.animateToRegion(mapLocation, 2000);
		}
	};

	const checkIfPanicIsOutOfRange = (_panicLocation) => {
		if (isDistanceLessThan(userLocation, _panicLocation)) {
			return false;
		} else {
			showErrorToast(
				`Action can only be performed within ${config.maxProximityDistance} meters of your location.`
			);
			return true;
		}
	};

	const handleAutoCompleteSearch = async (_searchQuery) => {
		setPanicSiteName(_searchQuery);
		const response = await locationActions.callGoogleAutoComplete(userLocation, _searchQuery);

		const locationList = (response.data ? response.data.predictions : []).map((aPrediction) => {
			const { description: placeDescription, place_id } = aPrediction;
			return { description: placeDescription, placeId: place_id };
		});

		setSearchedLocations(locationList);
	};

	const handleSearchedResultPress = async (result) => {
		const { placeId, description: placeDescription } = result;
		const response = await locationActions.callGooglePlacesApi(placeId);
		const { results } = response.data;

		if (results && results.length && results[0] && results[0].geometry) {
			const { lat: latitude, lng: longitude } = results[0].geometry.location;
			const location = { latitude, longitude };
			if (checkIfPanicIsOutOfRange(location)) {
				return;
			}
			setGooglePlaceId(placeId);
			setPanicSiteName(placeDescription);
			goToMapLocation(location);
			setPanicLocation(location);
			setSearchedLocations(null);
		}
	};

	const handlePanicTypeChange = (_panictype) => {
		const { value } = _panictype;
		setType(value);
	};

	const handleDescriptionChange = (_description) => {
		setDescription(_description);
	};

	const handleNumOfPlantsChange = (_numOfPlants) => {
		setNumberOfPlantsAffected(_numOfPlants);
	};

	const isPanicButtonDisabled = () => {
		console.log(panicSiteName, type, numOfPlantsAffected);
		return !(panicSiteName && type && numOfPlantsAffected);
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
					ref={(r) => {
						setMapRef(r);
					}}
					scrollEnabled={false}
					pitchEnabled={false}
					rotateEnabled={false}
					zoomEnabled={false}
				>
					{panicLocation ? <PanicMarker coordinate={{ latitude, longitude }} /> : null}
				</MapView>
			</View>

			<Text style={styles.whereIsItText}> Where is it?</Text>
			<View style={styles.formContainer}>
				<ScrollView contentContainerStyle={styles.form}>
					<AutoCompleteSearch
						onSearch={handleAutoCompleteSearch}
						results={searchedLocations}
						onResultPress={handleSearchedResultPress}
						showBorder={false}
						value={panicSiteName}
					/>

					<View style={styles.paddingBottomTen}>
						<Text style={styles.paddingBottomTen}> Type </Text>
						<SelectButton
							data={[{ value: 'fire', label: 'FIRE', selected: true }]}
							onSelectedItemChange={handlePanicTypeChange}
							atleastOneSelected
						/>
					</View>

					<View style={styles.paddingBottomTen}>
						<Text style={styles.paddingBottomTen}> Approx. number of plants affected </Text>
						<FormInput
							style={[styles.textInput]}
							keyboardType="number-pad"
							placeholder="Number of plants"
							onChangeText={handleNumOfPlantsChange}
						/>
					</View>

					<View style={styles.paddingBottomTen}>
						<Textarea
							rowSpan={3}
							style={styles.descriptionInput}
							placeholder="Description"
							onChangeText={handleDescriptionChange}
							placeholderTextColor={colors.gray}
						/>
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
				<View style={styles.cratePanicButtonContainer}>
					<Button
						style={[
							styles.cratePanicButton,
							isPanicButtonDisabled()
								? styles.cratePanicButtonDisabled
								: styles.cratePanicButtonEnabled,
						]}
						disabled={isPanicButtonDisabled()}
						success
						onPress={handleCreatePanic}
					>
						<Text> CREATE </Text>
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
	cratePanicButtonContainer: {
		position: 'absolute',
		left: 10,
		right: 10,
		bottom: 10,
		backgroundColor: 'white',
	},
	descriptionInput: { backgroundColor: colors.lightGray },
	cratePanicButton: { justifyContent: 'center', width: '100%' },
	cratePanicButtonDisabled: { opacity: 0.4 },
	cratePanicButtonEnabled: { opacity: 1 },
});

CreatePanicScreen.navigationOptions = ({ navigation }) => {
	const header = navigation.getParam('header', {
		headerTitle: (
			<OptionsBar
				title="Create a panic"
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

export default CreatePanicScreen;
