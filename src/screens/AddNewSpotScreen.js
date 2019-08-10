import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { View, Text, Button, Container } from 'native-base';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Permissions } from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';

import OptionsBar from '../components/Navigation/OptionsBar';
import Tree from '../components/Map/Tree';
import FormInput from '../components/shared/FormInput';
import SelectTreeHealth from '../components/shared/SelectTreeHealth';
import { addGroup } from '../store/actions/tree.action';
import { fetchUserLocation } from '../store/actions/location.action';

class AddNewSpotScreen extends React.Component {
	state = {
		photo: null,
		plants: 0,
		health: null,
		plantType: '',
		centerBias: 0.00015,
	};

	static navigationOptions = ({ navigation }) => {
		const header = {
			headerTitle: (
				<OptionsBar
					title="Add a spot"
					leftOption={{
						label: 'Cancel',
						action: () => navigation.navigate('Home'),
					}}
				/>
			),
			headerTransparent: true,
			headerStyle: {
				height: 80,
				backgroundColor: '#ffff',
				opacity: 0.8,
			},
			headerLeft: null,
		};

		return header;
	};

	componentWillMount() {
		const { fetchUserLocation } = this.props;
		fetchUserLocation();
	}

	handleNumberOfPlantsChange = (numberOfPlants) => {
		this.setState({ plants: numberOfPlants });
	};

	handlePlantType = (inputPlantType) => {
		this.setState({ plantType: inputPlantType });
	};

	handleSelectedStatusChange = (selectedStatus) => {
		const healthEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (healthEntry && healthEntry[0]) {
			this.setState({ health: healthEntry[0] });
		}
	};

	takePhoto = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

		const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			const pickerResult = await ImagePicker.launchCameraAsync({});
			this.setState({ photo: pickerResult.uri });
		}
	};

	handleAddSpot = () => {
		const { addGroup } = this.props;
		const { photo, plants, health, plantType } = this.state;
		const { userLocation } = this.props;
		const { latitude, longitude } = userLocation;
		const formData = this.createFormData(photo, {
			plants,
			plantType,
			health,
			lat: latitude,
			lng: longitude,
		});
		addGroup(formData);
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

	isAddButtonDisabled = () => {
		const { plants, health, plantType } = this.state;
		return !(plants && health && plantType);
	};

	render() {
		const { photo, health, centerBias } = this.state;
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
						<Tree coordinate={{ latitude, longitude }} status={health || 'healthy'} />
					</MapView>
				</View>

				<Text style={styles.whereIsItText}> Where is it?</Text>
				<View style={styles.form}>
					<FormInput
						placeholder="NUMBER OF PLANTS?"
						keyboardType="number-pad"
						onChangeText={this.handleNumberOfPlantsChange}
					/>
					<FormInput
						placeholder="PLANT TYPE"
						keyboardType="default"
						onChangeText={this.handlePlantType}
					/>
					<View>
						<Text style={styles.healthOfPlantText}> Health of plant(s) </Text>
						<SelectTreeHealth onSelectedStatusChange={this.handleSelectedStatusChange} />
					</View>
					{photo ? (
						<Image
							source={{ uri: photo }}
							resizeMode="contain"
							style={{ width: '100%', height: 150 }}
						/>
					) : (
						<TouchableOpacity style={styles.imageUploadContainer} onPress={this.takePhoto}>
							<Text> Take a photo</Text>
						</TouchableOpacity>
					)}
					<Button
						style={[
							styles.addButton,
							this.isAddButtonDisabled() ? styles.addButtonDisabled : styles.addButtonEnabled,
						]}
						disabled={this.isAddButtonDisabled()}
						success
						onPress={this.handleAddSpot}
					>
						<Text> ADD Plant </Text>
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
	},
	healthOfPlantText: {
		paddingBottom: 10,
	},
	imageUploadContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 150,
		backgroundColor: 'lightgray',
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
	addGroup: (flag) => dispatch(addGroup(flag)),
	fetchUserLocation: () => dispatch(fetchUserLocation()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddNewSpotScreen);
