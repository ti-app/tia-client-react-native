import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { View, Text, Container, Button, Icon } from 'native-base';
import MapView from 'react-native-maps';

import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import * as colors from '../../styles/colors';
import config from '../../config/common';
import Tree from '../../shared/Map/Tree/Tree';
import { showNeedApproval } from '../../utils/predefinedToasts';
import * as treeActions from '../../store/actions/tree.action';
import { selectUserRole } from '../../store/reducers/auth.reducer';
import { selectSelectedTreeGroup } from '../../store/reducers/tree.reducer';

const centerBias = 0.00015;

const TreeGroupDetails = ({ navigation }) => {
	const selectedTreeGroup = useSelector(selectSelectedTreeGroup);
	const userRole = useSelector(selectUserRole);

	const dispatch = useDispatch();
	const setSelectedTree = useCallback(
		(...param) => dispatch(treeActions.setSelectedTree(...param)),
		[dispatch]
	);
	const deleteTreeGroup = useCallback(
		(...param) => dispatch(treeActions.deleteTreeGroup(...param)),
		[dispatch]
	);
	const waterTreeGroup = useCallback((...param) => dispatch(treeActions.waterTreeGroup(...param)), [
		dispatch,
	]);

	const handleWaterTreeGroup = () => {
		waterTreeGroup(selectedTreeGroup);
	};

	const getFormattedDate = (date) => new Date(date).toDateString().substr(4, 12);

	const getDeleteButton = () => (
		<TouchableOpacity style={styles.deleteButton} onPress={showConfirmDeleteAlert}>
			<Icon
				type="MaterialIcons"
				name="delete"
				style={{ color: colors.red.toString(), fontSize: 24 }}
			/>
		</TouchableOpacity>
	);

	const showConfirmDeleteAlert = () => {
		// Works on both iOS and Android
		Alert.alert(
			'Delete Tree Group',
			'Are you sure? All the data associated this tree group will be lost. You will not be able to undo this operation.',
			[
				{
					text: 'Yes, Delete',
					onPress: deletePlantConfirmed,
					style: 'destructive',
				},
				{
					text: 'Cancel',
					onPress: () => {
						/** NOOP */
					},
					style: 'cancel',
				},
			],
			{ cancelable: false }
		);
	};

	const deletePlantConfirmed = () => {
		deleteTreeGroup(selectedTreeGroup);
	};

	const isModerator = () => {
		return userRole === config.roles.MODERATOR;
	};

	const selectTree = (tree) => {
		const deleteObject = tree.delete;
		const deleteNotApproved =
			deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;

		switch (true) {
			case deleteNotApproved && !isModerator():
				showNeedApproval();
				break;
			case deleteNotApproved && isModerator():
				setSelectedTree(tree);
				// setState({ approveTreeModal: { show: true, approveType: 'DELETE' } }); TODO: Put this in redux state and make it work
				break;
			default:
				setSelectedTree(tree);
				navigation.navigate('TreeDetails');
		}
	};

	// TODO: For now it will show trees radially with manual calculation, refactor later to show with the exact lat lng of trees.
	const renderTrees = (trees) => {
		return trees.map((tree) => {
			const { location } = tree;
			const { coordinates } = location;

			const longitude = coordinates[0];
			const latitude = coordinates[1];

			const deleteObject = tree.delete;

			return (
				<Tree
					key={tree._id}
					coordinate={{ longitude, latitude }}
					onPress={() => {
						selectTree(tree);
					}}
					status={tree.health}
					deleteNotApproved={
						deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved
					}
				/>
			);
		});
	};

	if (!selectedTreeGroup) {
		return <Text>Loading...</Text>;
	}

	const { location, owner, uploadedDate, photo, lastActivityDate, trees } = selectedTreeGroup;

	const { longitude, latitude } = location;
	const formattedLastActivityDate = lastActivityDate && getFormattedDate(lastActivityDate);
	const formattedUploadedDate = uploadedDate && getFormattedDate(uploadedDate);

	const plantTypes = [
		...new Set(trees.filter(({ plantType }) => !!plantType).map(({ plantType }) => plantType)),
	];

	return (
		<Container style={styles.container}>
			<View style={styles.mapView}>
				<MapView
					style={styles.mapView}
					initialRegion={{
						latitude: latitude + centerBias, // Added bias for center of map to align it properly in the viewport, temporary solution. TODO: Think of better way.
						longitude,
						latitudeDelta: 0.000892007226706992,
						longitudeDelta: 0.000605057826519012,
					}}
					scrollEnabled={false}
					pitchEnabled={false}
					rotateEnabled={false}
					zoomEnabled={false}
				>
					{renderTrees(trees)}
				</MapView>
			</View>

			<View style={styles.heading}>
				<Text style={styles.plantType}>{plantTypes.join(', ') || 'Plant type not specified'}</Text>
				<View style={styles.modifyButtonContainer}>
					{/* {isModerator() && getEditButton()} */}
					{getDeleteButton()}
				</View>
			</View>

			<View style={styles.treeDetailsGroupContainer}>
				<ScrollView contentContainerStyle={styles.treeDetailsGroup}>
					<Text style={styles.treeGroupInfo}>Number of plants: {trees.length}</Text>
					{owner && owner.displayName && (
						<Text style={styles.treeGroupInfo}>Uploaded by : {owner.displayName}</Text>
					)}
					{formattedUploadedDate && (
						<Text style={styles.treeGroupInfo}>Created on {formattedUploadedDate}</Text>
					)}
					<Text style={styles.treeGroupInfo}>
						Last watered on {formattedLastActivityDate}. Please don&apos;t forget to water me.
					</Text>
					{photo && photo.length > 0 ? (
						<Image
							source={{
								uri: photo,
							}}
							resizeMode="contain"
							style={styles.image}
						/>
					) : (
						<View style={styles.imageNotFound}>
							<Text style={styles.imageNotFoundText}>No Image.</Text>
						</View>
					)}
				</ScrollView>
			</View>
			<View style={styles.waterButtonContainer}>
				<Button
					style={{
						...styles.waterButton,
					}}
					success
					onPress={handleWaterTreeGroup}
				>
					<Text style={styles.waterButtonText}>WATERED</Text>
				</Button>
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapView: { flex: 1.0, height: '100%' },
	treeDetailsGroupContainer: {
		flex: 1.4,
	},
	treeDetailsGroup: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingRight: 16,
		paddingLeft: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
	heading: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingRight: 16,
		paddingLeft: 16,
	},
	modifyButtonContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	plantType: {
		textAlignVertical: 'center',
		fontSize: 20,
	},
	addressLabel: { fontSize: 20, paddingRight: 8 },
	treeGroupInfo: {
		fontSize: 12,
		color: colors.gray,
	},
	lastWateredText: { fontSize: 12, color: colors.gray },
	waterButtonContainer: {
		position: 'absolute',
		left: 10,
		right: 10,
		bottom: 10,
		backgroundColor: 'white',
	},
	waterButton: {
		justifyContent: 'center',
		width: '100%',
	},
	deleteButton: {
		padding: 8,
		borderColor: 'black',
	},
	editButton: {
		padding: 8,
		borderColor: 'black',
	},
	waterButtonText: { textAlign: 'center' },
	image: { width: '100%', height: 200 },
	imageNotFound: {
		width: '100%',
		height: 200,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: colors.lightGray,
	},
	imageNotFoundText: { textAlign: 'center' },
});

TreeGroupDetails.navigationOptions = ({ navigation }) => {
	const header = {
		headerTitle: (
			<OptionsBar
				leftOption={{
					action: () => {
						navigation.goBack();
					},
				}}
				title="Tree Group Details"
			/>
		),
		headerTransparent: true,
		headerStyle: {
			backgroundColor: colors.white,
			opacity: 0.8,
		},
		headerLeft: null,
	};
	return header;
};

export default TreeGroupDetails;
