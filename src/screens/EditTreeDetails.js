import React from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	ImageBackground,
	ScrollView,
	TouchableOpacity,
	Platform,
	Keyboard,
} from 'react-native';
import { View, Text, Container, Button, CheckBox } from 'native-base';
import MapView from 'react-native-maps';
import { Permissions } from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';

import Tree from '../components/Map/Tree';
import OptionsBar from '../components/Navigation/OptionsBar';
import * as colors from '../styles/colors';
import FormInput from '../components/shared/FormInput';
import SelectTreeHealth from '../components/shared/SelectTreeHealth';
import { updateTree } from '../store/actions/tree.action';

class TreeDetails extends React.Component {
	constructor(props) {
		super(props);
		const { selectedTreeDetails } = props;

		const photoURL = selectedTreeDetails ? selectedTreeDetails.photo : null;
		const { health, location, plantType, healthCycle, _id } = selectedTreeDetails;

		this.state = {
			id: _id,
			centerBias: 0.00015,
			changePlantLocation: false,
			photoURL,
			updatedPhoto: null,
			health,
			currentLocation: location,
			updatedLocation: location,
			plantType,
			healthCycle,
			isKeyboardOpen: false,
		};
	}

	static navigationOptions = ({ navigation }) => {
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

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	_keyboardDidShow() {
		this.setState({ isKeyboardOpen: true });
	}

	_keyboardDidHide() {
		this.setState({ isKeyboardOpen: false });
	}

	takePhoto = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

		const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.75 });
			console.log(pickerResult.uri);
			this.setState({ updatedPhoto: pickerResult.uri });
		}
	};

	// TODO: Check Api for location and update following method to support updated location
	handleUpdateTree = () => {
		const { id, health, plantType, healthCycle, updatedPhoto } = this.state;

		const { updateTree } = this.props;

		const formData = this.createFormData(updatedPhoto, {
			plantType,
			healthCycle,
			health,
		});

		updateTree(id, formData);
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

	handlePlantType = (plantType) => this.setState({ plantType });

	handleWaterCycleChange = (healthCycle) => this.setState({ healthCycle });

	handleSelectedStatusChange = (selectedStatus) => {
		const healthEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (healthEntry && healthEntry[0]) {
			this.setState({ health: healthEntry[0] });
		}
	};

	handlePlantLocationChange = () => {
		const { changePlantLocation } = this.state;
		if (!changePlantLocation) {
			// Change plant location
			const { userLocation } = this.props;
			const { latitude, longitude } = userLocation;
			this.setState({ updatedLocation: { coordinates: [longitude, latitude] } });
		} else {
			// Reset plant location
			const { currentLocation } = this.state;
			this.setState({ updatedLocation: currentLocation });
		}
		this.setState({ changePlantLocation: !changePlantLocation });
	};

	render() {
		const { centerBias, changePlantLocation } = this.state;
		const { selectedTreeDetails } = this.props;

		if (!selectedTreeDetails) {
			return <Text>Loading...</Text>;
		}

		const {
			photoURL,
			health,
			updatedLocation,
			plantType,
			healthCycle,
			updatedPhoto,
			isKeyboardOpen,
		} = this.state;

		const { coordinates } = updatedLocation;
		const [longitude, latitude] = coordinates;

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
							onPress={this.handlePlantLocationChange}
						>
							<View style={styles.updatePlantLocationCheckBox}>
								<CheckBox checked={changePlantLocation} color={colors.green} />
							</View>
							<Text> Update plant location to my current location</Text>
						</TouchableOpacity>

						<FormInput
							placeholder="Plant type"
							keyboardType="default"
							value={plantType}
							onChangeText={this.handlePlantType}
						/>
						<FormInput
							placeholder="Water cycle"
							keyboardType="number-pad"
							value={`${healthCycle}`} // Written as a template string cause healthCycle is a number
							onChangeText={this.handleWaterCycleChange}
						/>

						<View>
							<Text style={styles.paddingBottomTen}> Health of a plant </Text>
							<View style={styles.paddingBottomTen}>
								<SelectTreeHealth
									presetHealthStatus={presetHealthStatus}
									onSelectedStatusChange={this.handleSelectedStatusChange}
								/>
							</View>
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
						<Button style={styles.updateButton} success onPress={this.handleUpdateTree}>
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

const mapStateToProps = (state) => ({
	selectedTreeDetails: state.tree.selectedTreeDetails,
	userLocation: state.location.userLocation,
});

const mapDispatchToProps = (dispatch) => ({
	updateTree: (...params) => dispatch(updateTree(...params)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TreeDetails);
