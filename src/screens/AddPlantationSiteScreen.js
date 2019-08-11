import React from 'react';
import { StyleSheet /* ,TouchableOpacity, Image,  Platform */ } from 'react-native';
import { Container, View, Text, Button, CheckBox } from 'native-base';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
// import { Permissions } from 'react-native-unimodules';
// import * as ImagePicker from 'expo-image-picker';

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
		// photo: null,
		type: null,
		wateringNearBy: false,
		soilQuality: null,
		plants: 0,
		centerBias: 0.00015,
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

	handleNumberOfPlantsChange = (numberOfPlants) => {
		this.setState({ plants: numberOfPlants });
	};

	// takePhoto = async () => {
	// 	const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

	// 	const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

	// 	if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
	// 		const pickerResult = await ImagePicker.launchCameraAsync({});
	// 		this.setState({ photo: pickerResult.uri });
	// 	}
	// };

	handleAddSpot = () => {
		const { addPlantationSite } = this.props;
		const {
			/* type, wateringNearBy, soilQuality, photo, */ plants,
			soilQuality,
			wateringNearBy,
			type,
		} = this.state;
		const { userLocation } = this.props;
		const { latitude, longitude } = userLocation;

		const plantationSite = {
			site: {
				type,
				wateringNearBy,
				soilQuality,
				numberOfPlants: plants,
				location: { lat: latitude, lng: longitude },
			},
		};

		// const formData = this.createFormData(photo, {
		// 	numberOfPlants: plants,
		// 	lat: latitude,
		// 	lng: longitude,
		// 	// type: 'public',
		// 	// wateringNearBy: true,
		// 	// soilQuality: 'good',
		// });
		addPlantationSite(plantationSite);
	};

	// createFormData = (uri, body) => {
	// 	const data = new FormData();
	// 	if (uri) {
	// 		const filename = uri.split('/').pop();
	// 		const type = filename.split('.').pop();

	// 		data.append('photo', {
	// 			uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
	// 			type: `image/${type}`,
	// 			name: filename,
	// 		});
	// 	}

	// 	Object.keys(body).forEach((key) => {
	// 		data.append(key, body[key]);
	// 	});

	// 	return data;
	// };

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
		const { plants, soilQuality, type } = this.state;
		return !(plants && soilQuality && type);
	};

	render() {
		const { centerBias, wateringNearBy } = this.state;
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
				<View style={styles.form}>
					<FormInput
						placeholder="No. of plants in site?"
						keyboardType="number-pad"
						onChangeText={this.handleNumberOfPlantsChange}
					/>
					<View style={styles.wateringNearBy}>
						<View style={styles.wateringNearByCheckBox}>
							<CheckBox
								checked={wateringNearBy}
								color={colors.green}
								onPress={this.handleOnWateringNearbyChange}
							/>
						</View>
						<Text> Watering Nearby </Text>
					</View>
					<View>
						<Text style={styles.healthOfPlantText}> Soil Quality </Text>
						<SelectSoilQuality onSelectedSoilQualityChange={this.handleSoilQualityChange} />
					</View>

					<View>
						<Text style={styles.healthOfPlantText}> Property Type </Text>
						<SelectPropertyType onSelectedPropertyTypeChange={this.handlePropertyTypeChange} />
					</View>

					{/* {photo ? (
						<Image
							source={{ uri: photo }}
							resizeMode="contain"
							style={{ width: '100%', height: 150 }}
						/>
					) : (
						<TouchableOpacity style={styles.imageUploadContainer} onPress={this.takePhoto}>
							<Text> Take a photo</Text>
						</TouchableOpacity>
					)} */}

					<Button
						style={[
							styles.addButton,
							this.isAddButtonDisabled() ? styles.addButtonDisabled : styles.addButtonEnabled,
						]}
						disabled={this.isAddButtonDisabled()}
						success
						onPress={this.handleAddSpot}
					>
						<Text> ADD </Text>
					</Button>
				</View>
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
	form: {
		flex: 1.4,
		display: 'flex',
		flexDirection: 'column',
		padding: 20,
		justifyContent: 'space-between',
		height: '100%',
	},
	imageUploadContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 150,
		backgroundColor: 'lightgray',
	},
	wateringNearBy: {
		display: 'flex',
		flexDirection: 'row',
	},
	wateringNearByCheckBox: {
		paddingRight: 16,
	},
	imageContainer: {
		width: '100%',
		height: 150,
	},
	image: {
		width: '100%',
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
