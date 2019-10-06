import React from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { View, Text, Container } from 'native-base';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { Permissions } from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';

import Tree from '../../components/Map/Tree';
import { setNewTreeGroupData } from '../../store/actions/tree.action';
import { fetchUserLocation } from '../../store/actions/location.action';

class AddNewSpotScreen extends React.Component {
	state = {
		centerBias: 0.00015,
	};

	static navigationOptions = () => ({ header: null });

	componentWillMount() {
		const { fetchUserLocation } = this.props;
		fetchUserLocation();
	}

	takePhoto = async () => {
		const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

		const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
			const pickerResult = await ImagePicker.launchCameraAsync({ quality: 0.75 });
			const { setNewTreeGroupData } = this.props;
			setNewTreeGroupData({ photo: pickerResult.uri });
		}
	};

	renderTrees = (health) => {
		const { newTreeGroup } = this.props;
		const { trees: treeCoordinates } = newTreeGroup;
		return treeCoordinates.map((aCoord, idx) => (
			// eslint-disable-next-line react/no-array-index-key
			<Tree key={idx} coordinate={aCoord} status={health} />
		));
	};

	render() {
		const { centerBias } = this.state;
		const { userLocation, newTreeGroup } = this.props;
		const { latitude, longitude } = userLocation;
		const { photo } = newTreeGroup;

		return (
			<Container style={styles.container}>
				<View style={styles.mapViewContainer}>
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
						{this.renderTrees()}
					</MapView>
				</View>

				<Text style={styles.formTitle}>Add Photo</Text>
				<View style={styles.formContainer}>
					<ScrollView contentContainerStyle={styles.form}>
						{photo ? (
							<Image source={{ uri: photo }} resizeMode="contain" style={styles.image} />
						) : (
							<TouchableOpacity style={styles.imageUploadContainer} onPress={this.takePhoto}>
								<Text> Take a photo</Text>
							</TouchableOpacity>
						)}
					</ScrollView>
				</View>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapViewContainer: { height: '40%' },
	mapView: { height: '100%' },
	formTitle: {
		fontSize: 25,
	},
	formContainer: { height: '60%' },
	form: {
		display: 'flex',
		flexDirection: 'column',
		padding: 20,
	},
	paddingBottomTen: {
		paddingBottom: 10,
	},
	imageUploadContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 300,
		backgroundColor: 'lightgray',
		marginBottom: 40,
	},
	image: {
		width: '100%',
		height: 300,
		marginBottom: 40,
	},
});

const mapStateToProps = (state) => ({
	userLocation: state.location.userLocation,
	newTreeGroup: state.tree.newTreeGroup,
});

const mapDispatchToProps = (dispatch) => ({
	fetchUserLocation: () => dispatch(fetchUserLocation()),
	setNewTreeGroupData: (...params) => dispatch(setNewTreeGroupData(...params)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddNewSpotScreen);
