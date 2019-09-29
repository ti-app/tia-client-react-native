import React from 'react';
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
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Permissions } from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';

import OptionsBar from '../components/Navigation/OptionsBar';
import PlantationSite from '../components/Map/PlantationSite';
import FormInput from '../components/shared/FormInput';
import SelectSoilQuality from '../components/shared/SelectSoilQuality';
import SelectPropertyType from '../components/shared/SelectPropertyType';
import { updatePlantationSite } from '../store/actions/plantation-site.action';
import * as colors from '../styles/colors';

class AddPlantationSiteScreen extends React.Component {
	constructor(props) {
		super(props);
		const { selectedPlantationSite } = props;

		const {
			wateringNearBy,
			soilQuality,
			numberOfPlants,
			location,
			type,
			siteDisplayName,
			id,
			photo: photoURL,
		} = selectedPlantationSite;

		this.state = {
			id,
			siteDisplayName,
			type,
			wateringNearBy: wateringNearBy === 'true',
			soilQuality,
			numberOfPlants,
			centerBias: 0.00015,
			isKeyboardOpen: false,
			currentLocation: location,
			updatedLocation: location,
			changePlantLocation: false,
			updatedPhoto: null,
			photoURL,
		};
	}

	static navigationOptions = ({ navigation }) => {
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

	componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			this._keyboardDidShow.bind(this)
		);
		this.keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			this._keyboardDidHide.bind(this)
		);
	}

	takePhoto = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

		const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.75 });
			this.setState({ updatedPhoto: pickerResult.uri });
		}
	};

	_keyboardDidShow() {
		this.setState({ isKeyboardOpen: true });
	}

	_keyboardDidHide() {
		this.setState({ isKeyboardOpen: false });
	}

	handlePlantLocationChange = () => {
		const { changePlantLocation } = this.state;
		if (!changePlantLocation) {
			// Change plant location
			const { userLocation } = this.props;
			const { latitude, longitude } = userLocation;
			this.setState({ updatedLocation: { longitude, latitude } });
		} else {
			// Reset plant location
			const { currentLocation } = this.state;
			this.setState({ updatedLocation: currentLocation });
		}
		this.setState({ changePlantLocation: !changePlantLocation });
	};

	handleSiteNameChange = (siteDisplayName) => {
		this.setState({ siteDisplayName });
	};

	handleNumberOfPlantsChange = (numberOfPlants) => {
		this.setState({ numberOfPlants });
	};

	// TODO: Check Api for location and update following method to support updated location
	handleUpdateSite = () => {
		const {
			type,
			wateringNearBy,
			soilQuality,
			updatedPhoto,
			numberOfPlants,
			siteDisplayName,
			id,
		} = this.state;

		const { updatePlantationSite } = this.props;

		console.log(siteDisplayName, numberOfPlants, type, wateringNearBy, soilQuality);

		const formData = this.createFormData(updatedPhoto, {
			siteDisplayName,
			numberOfPlants,
			type,
			wateringNearBy,
			soilQuality,
		});

		updatePlantationSite(id, formData);
	};

	createFormData = (uri, body) => {
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

	handleOnWateringNearbyChange = () => {
		this.setState(({ wateringNearBy }) => ({ wateringNearBy: !wateringNearBy }));
	};

	handleSoilQualityChange = (selectedStatus) => {
		const soilQualityEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (soilQualityEntry && soilQualityEntry[0]) {
			this.setState({ soilQuality: soilQualityEntry[0] });
		}
	};

	handlePropertyTypeChange = (selectedStatus) => {
		const typeEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (typeEntry && typeEntry[0]) {
			if (typeEntry[0] === 'publicProperty') {
				this.setState({ type: 'public' });
			}
			if (typeEntry[0] === 'privateProperty') {
				this.setState({ type: 'private' });
			}
		}
	};

	render() {
		const {
			centerBias,
			wateringNearBy,
			isKeyboardOpen,
			siteDisplayName,
			numberOfPlants,
			soilQuality,
			changePlantLocation,
			updatedPhoto,
			photoURL,
			updatedLocation,
			type,
		} = this.state;

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
							onPress={this.handlePlantLocationChange}
						>
							<View style={styles.updatePlantLocationCheckBox}>
								<CheckBox value={changePlantLocation} />
							</View>
							<Text style={styles.updatePlantLocationText}>
								Update site location to my current location
							</Text>
						</TouchableOpacity>

						<FormInput
							placeholder="Site name"
							value={siteDisplayName}
							onChangeText={this.handleSiteNameChange}
						/>

						<FormInput
							placeholder="No. of plants in site?"
							keyboardType="number-pad"
							value={numberOfPlants}
							onChangeText={this.handleNumberOfPlantsChange}
						/>

						<TouchableOpacity
							style={[styles.wateringNearBy, styles.paddingBottomTen]}
							onPress={this.handleOnWateringNearbyChange}
						>
							<View style={styles.wateringNearByCheckBox}>
								<CheckBox
									color={colors.green}
									value={wateringNearBy}
									onValueChange={this.handleOnWateringNearbyChange}
								/>
							</View>
							<Text style={styles.wateringNearbyText}> Is Watering Available Nearby? </Text>
						</TouchableOpacity>

						<View style={styles.paddingBottomTen}>
							<Text style={styles.paddingBottomTen}> Soil Quality </Text>
							<SelectSoilQuality
								presetSoilQuality={presetSoilQuality}
								onSelectedSoilQualityChange={this.handleSoilQualityChange}
							/>
						</View>

						<View style={styles.paddingBottomTen}>
							<Text style={styles.paddingBottomTen}> Property Type </Text>
							<SelectPropertyType
								presetType={presetType}
								onSelectedPropertyTypeChange={this.handlePropertyTypeChange}
							/>
						</View>

						{(photoURL && photoURL.length > 0) || updatedPhoto ? (
							<TouchableOpacity onPress={this.takePhoto}>
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
							<TouchableOpacity style={styles.addImage} onPress={this.takePhoto}>
								<Text style={styles.addImageText}>Add photo</Text>
							</TouchableOpacity>
						)}
					</ScrollView>
				</View>

				{!isKeyboardOpen ? (
					<View style={styles.updateButtonContainer}>
						<Button style={[styles.updateButton]} success onPress={this.handleUpdateSite}>
							<Text> UPDATE </Text>
						</Button>
					</View>
				) : null}
			</Container>
		);
	}
}

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

const mapStateToProps = (state) => ({
	selectedPlantationSite: state.plantationSite.selectedPlantationSite,
	userLocation: state.location.userLocation,
});

const mapDispatchToProps = (dispatch) => ({
	updatePlantationSite: (...param) => dispatch(updatePlantationSite(...param)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddPlantationSiteScreen);
