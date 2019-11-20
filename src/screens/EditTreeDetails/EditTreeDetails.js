import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, ImageBackground, ScrollView, TouchableOpacity, CheckBox } from 'react-native';
import { View, Text, Container, Button } from 'native-base';
import MapView from 'react-native-maps';
import { RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import Tree from '../../shared/Map/Tree/Tree';
import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import FormInput from '../../shared/FormInput/FormInput';
import SelectButton from '../../shared/SelectButton/SelectButton';
import * as locationActions from '../../store/actions/location.action';
import * as treeActions from '../../store/actions/tree.action';
import { selectSelectedTree } from '../../store/reducers/tree.reducer';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import * as colors from '../../styles/colors';
import { createFormData } from '../../utils/misc';
import { useKeyboardHideHook } from '../../utils/customHooks';

const centerBias = 0.00015;

const EditTreeDetails = () => {
	const [id, setId] = useState(null);
	const [health, setHealth] = useState(null);
	const [healthCycle, setHealthCycle] = useState(null);
	const [currentLocation, setCurrentLocation] = useState({});
	const [updatedLocation, setUpdatedLocation] = useState({});
	const [photoURL, setPhotoURL] = useState(null);
	const [changePlantLocation, setChangePlantLocation] = useState(false);
	const [updatedPhoto, setUpdatedPhoto] = useState(null);
	const [plantType, setPlantType] = useState('');

	const [isKeyboardOpen] = useKeyboardHideHook();

	const selectedTree = useSelector(selectSelectedTree);
	const userLocation = useSelector(selectUserLocation);

	const dispatch = useDispatch();
	const updateTree = useCallback((...param) => dispatch(treeActions.updateTree(...param)), [
		dispatch,
	]);
	const fetchUserLocation = useCallback(() => dispatch(locationActions.fetchUserLocation()), [
		dispatch,
	]);

	useEffect(() => {
		const {
			health: _health,
			location: _location,
			plantType: _plantType,
			healthCycle: _healthCycle,
			_id,
			photo: _photoURL,
		} = selectedTree;
		setId(_id);
		setHealth(_health);
		setCurrentLocation(_location);
		setUpdatedLocation(_location);
		setPlantType(_plantType);
		setHealthCycle(_healthCycle);
		setPhotoURL(_photoURL);
	}, [selectedTree]);

	useEffect(() => {
		fetchUserLocation();
	}, []);

	const takePhoto = async () => {
		const result = await request(PERMISSIONS.ANDROID.CAMERA);

		if (result === RESULTS.GRANTED) {
			const pickerResult = await ImagePicker.openCamera({ compressImageQuality: 0.75 });
			setUpdatedPhoto(pickerResult.path);
		}
	};

	// TODO: Check Api for location and update following method to support updated location
	const handleUpdateTree = () => {
		const formData = createFormData(
			{
				plantType,
				healthCycle,
				health,
			},
			updatedPhoto
		);

		updateTree(id, formData);
	};

	const handlePlantType = (_plantType) => setPlantType(_plantType);

	const handleWaterCycleChange = (_healthCycle) => setHealthCycle(_healthCycle);

	const handleSelectedStatusChange = (_status) => {
		const { value } = _status;
		setHealth({ health: value });
	};

	const handlePlantLocationChange = () => {
		if (!changePlantLocation) {
			// Change plant location
			const { latitude, longitude } = userLocation;
			setUpdatedLocation({ coordinates: [longitude, latitude] });
		} else {
			// Reset plant location
			setUpdatedLocation(currentLocation);
		}
		setChangePlantLocation((_changePlantLocation) => !_changePlantLocation);
	};

	if (!selectedTree) {
		return <Text>Loading...</Text>;
	}

	const { coordinates } = updatedLocation || {};
	const [longitude, latitude] = coordinates || [0, 0];

	const presetHealthStatus = { healthy: false, weak: false, almostDead: false };
	presetHealthStatus[health] = true;

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

			<View style={styles.formContainer}>
				<ScrollView contentContainerStyle={styles.form}>
					<TouchableOpacity
						style={[styles.updatePlantLocation, styles.paddingBottomTen]}
						onPress={handlePlantLocationChange}
					>
						<View style={styles.updatePlantLocationCheckBox}>
							<CheckBox value={changePlantLocation} color={colors.green} />
						</View>
						<Text> Update plant location to my current location</Text>
					</TouchableOpacity>

					<FormInput
						placeholder="Plant type"
						keyboardType="default"
						value={plantType}
						onChangeText={handlePlantType}
					/>
					<FormInput
						placeholder="Water cycle"
						keyboardType="number-pad"
						value={`${healthCycle}`} // Written as a template string cause healthCycle is a number
						onChangeText={handleWaterCycleChange}
					/>

					<View>
						<Text style={styles.paddingBottomTen}> Health of a plant </Text>
						<View style={styles.paddingBottomTen}>
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

					{(photoURL && photoURL.length > 0) || updatedPhoto ? (
						<TouchableOpacity onPress={takePhoto}>
							<ImageBackground
								source={{
									uri: updatedPhoto || photoURL,
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
					<Button style={styles.updateButton} success onPress={handleUpdateTree}>
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
	mapView: { flex: 1.0, height: '100%' },
	formContainer: {
		flex: 2,
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingRight: 16,
		paddingLeft: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
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

EditTreeDetails.navigationOptions = ({ navigation }) => {
	const header = {
		headerTitle: (
			<OptionsBar
				title="Edit a tree"
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
	};

	return header;
};

export default EditTreeDetails;
