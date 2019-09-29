import React from 'react';
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
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Permissions } from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';

import OptionsBar from '../components/Navigation/OptionsBar';
import PlantationSite from '../components/Map/PlantationSite';
import FormInput from '../components/shared/FormInput';
import SelectSoilQuality from '../components/shared/SelectSoilQuality';
import SelectPropertyType from '../components/shared/SelectPropertyType';
import { addPlantationSite } from '../store/actions/plantation-site.action';
import { fetchUserLocation } from '../store/actions/location.action';
import * as colors from '../styles/colors';

class AddPlantationSiteScreen extends React.Component {
	state = {
		photo: null,
		siteDisplayName: '',
		type: null,
		wateringNearBy: false,
		soilQuality: null,
		plants: 0,
		centerBias: 0.00015,
		isKeyboardOpen: false,
	};

	static navigationOptions = ({ navigation }) => {
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

	componentWillMount() {
		const { fetchUserLocation } = this.props;
		fetchUserLocation();
	}

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
			console.log('here');
			const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.75 });
			console.log('now here', pickerResult);
			this.setState({ photo: pickerResult.uri });
		}
	};

	_keyboardDidShow() {
		this.setState({ isKeyboardOpen: true });
	}

	_keyboardDidHide() {
		this.setState({ isKeyboardOpen: false });
	}

	handleSiteNameChange = (siteDisplayName) => {
		this.setState({ siteDisplayName });
	};

	handleNumberOfPlantsChange = (numberOfPlants) => {
		this.setState({ plants: numberOfPlants });
	};

	handleAddSite = () => {
		const { addPlantationSite } = this.props;
		const { type, wateringNearBy, soilQuality, photo, plants, siteDisplayName } = this.state;
		const { userLocation } = this.props;
		const { latitude, longitude } = userLocation;

		console.log(
			siteDisplayName,
			plants,
			latitude,
			longitude,
			type,
			wateringNearBy,
			soilQuality,
			photo
		);

		const formData = this.createFormData(photo, {
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

	isAddButtonDisabled = () => {
		const { plants, soilQuality, type, siteDisplayName } = this.state;
		return !(plants && soilQuality && type && siteDisplayName);
	};

	render() {
		const { centerBias, wateringNearBy, isKeyboardOpen, photo } = this.state;
		const { userLocation } = this.props;
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
						<FormInput placeholder="Site name" onChangeText={this.handleSiteNameChange} />
						<FormInput
							placeholder="No. of plants in site?"
							keyboardType="number-pad"
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
							<SelectSoilQuality onSelectedSoilQualityChange={this.handleSoilQualityChange} />
						</View>

						<View style={styles.paddingBottomTen}>
							<Text style={styles.paddingBottomTen}> Property Type </Text>
							<SelectPropertyType onSelectedPropertyTypeChange={this.handlePropertyTypeChange} />
						</View>

						{photo ? (
							<Image source={{ uri: photo }} resizeMode="contain" style={styles.image} />
						) : (
							<TouchableOpacity style={styles.imageUploadContainer} onPress={this.takePhoto}>
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
								this.isAddButtonDisabled() ? styles.addButtonDisabled : styles.addButtonEnabled,
							]}
							disabled={this.isAddButtonDisabled()}
							success
							onPress={this.handleAddSite}
						>
							<Text> ADD </Text>
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

const mapStateToProps = (state) => ({
	userLocation: state.location.userLocation,
});

const mapDispatchToProps = (dispatch) => ({
	addPlantationSite: (flag) => dispatch(addPlantationSite(flag)),
	fetchUserLocation: () => dispatch(fetchUserLocation()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddPlantationSiteScreen);
