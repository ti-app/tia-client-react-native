import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Container, View, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Permissions } from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';

import OptionsBar from '../components/Navigation/OptionsBar';
import Tree from '../components/Map/Tree';
import FormInput from '../components/shared/FormInput';
import { addGroup } from '../store/actions/tree.action';
import { fetchUserLocation } from '../store/actions/location.action';
import * as colors from '../styles/colors';

class AddPlantionSiteScreen extends React.Component {
	state = {
		photo: null,
		plants: 0,
		health: null,
		centerBias: 0.00015,
	};

	static navigationOptions = ({ navigation }) => {
		const header = navigation.getParam('header', {
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
		const { photo, plants } = this.state;
		const { userLocation } = this.props;
		const { latitude, longitude } = userLocation;
		const formData = this.createFormData(photo, {
			plants,
			health: 'plantationSite',
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
		const { plants } = this.state;
		return !plants;
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
						<Tree coordinate={{ latitude, longitude }} status={health || 'plantationSite'} />
					</MapView>
				</View>

				<Text style={styles.whereIsItText}> Where is it?</Text>
				<View style={styles.form}>
					<FormInput
						placeholder="No. of Plants in site?"
						keyboardType="number-pad"
						onChangeText={this.handleNumberOfPlantsChange}
					/>
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
						<Text> Add site </Text>
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
	// mapCenter: state.location.mapCenter,
	userLocation: state.location.userLocation,
});

const mapDispatchToProps = (dispatch) => ({
	addGroup: (flag) => dispatch(addGroup(flag)),
	fetchUserLocation: () => dispatch(fetchUserLocation()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddPlantionSiteScreen);
