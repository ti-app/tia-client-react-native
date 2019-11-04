import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { View, Text, Container } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import Tree from '../../shared/Map/Tree/Tree';
import * as treeActions from '../../store/actions/tree.action';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';

const centerBias = 0.00015;
const SetPhoto = () => {
	const userLocation = useSelector(selectUserLocation);
	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const setNewTreeGroupData = useCallback(
		(...params) => dispatch(treeActions.setNewTreeGroupData(...params)),
		[dispatch]
	);

	const takePhoto = async () => {
		const result = await request(PERMISSIONS.ANDROID.CAMERA);

		if (result === RESULTS.GRANTED) {
			const pickerResult = await ImagePicker.openCamera({ compressImageQuality: 0.75 });
			setNewTreeGroupData({ photo: pickerResult.path });
		}
	};

	const renderTrees = (health) => {
		const { trees } = newTreeGroup;
		return trees.map((aCoord, idx) => (
			<Tree key={idx} coordinate={aCoord} status={health || 'healthy'} />
		));
	};

	const { latitude, longitude } = userLocation;
	const { photo, health } = newTreeGroup;

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
					{renderTrees(health)}
				</MapView>
			</View>

			<View style={styles.formContainer}>
				<Text style={styles.formTitle}>Add Photo</Text>
				<ScrollView contentContainerStyle={styles.form}>
					{photo ? (
						<Image source={{ uri: photo }} resizeMode="contain" style={styles.image} />
					) : (
						<TouchableOpacity style={styles.imageUploadContainer} onPress={takePhoto}>
							<Text> Take a photo</Text>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>
		</Container>
	);
};

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
	setNewTreeGroupData: (...params) => dispatch(setNewTreeGroupData(...params)),
});

SetPhoto.navigationOptions = () => ({ header: null });

export default SetPhoto;
