import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { View, Text, Container, Button } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';

import { waterTree, deleteTree } from '../store/actions/tree.action';
import Tree from '../components/Map/Tree';
import TreeDetailsNavBar from '../components/Navigation/TreeDetailsNavBar';
import * as colors from '../styles/colors';
import config from '../config/common';

class TreeDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			centerBias: 0.00015,
		};
	}

	static navigationOptions = ({ navigation }) => {
		const header = {
			headerTitle: (
				<TreeDetailsNavBar
					leftOption={{
						action: () => {
							navigation.navigate('Home');
						},
					}}
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

	renderWeekStatus = (weekStatus) => (
		<View style={styles.weekStatus}>
			{weekStatus.map((aWeek) => (
				<View key={aWeek.key} style={{ ...styles.weekDot, ...styles[aWeek.status] }} />
			))}
		</View>
	);

	handleWaterTree = () => {
		const { selectedTree, waterTree } = this.props;
		const treeWatered = selectedTree;
		waterTree(treeWatered);
	};

	deletePlantConfirmed = () => {
		const { deleteTree, selectedTree } = this.props;
		const treeToDelete = selectedTree;
		deleteTree(treeToDelete);
	};

	editTree = () => {
		const { navigation } = this.props;
		navigation.navigate('EditTree');
	};

	showConfirmDeleteAlert = () => {
		// Works on both iOS and Android
		Alert.alert(
			'Delete Plant',
			'Are you sure? All the data associated this plant will be lost. You will not be able to undo this operation.',
			[
				{
					text: 'Yes, Delete',
					onPress: this.deletePlantConfirmed,
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

	getDeleteButton = () => (
		<TouchableOpacity style={styles.deleteButton} onPress={this.showConfirmDeleteAlert}>
			<MaterialIcons name="delete" size={24} color={colors.red.toString()} />
		</TouchableOpacity>
	);

	getEditButton = () => (
		<TouchableOpacity style={styles.editButton} onPress={this.editTree}>
			<MaterialIcons name="edit" size={24} color={colors.black.toString()} />
		</TouchableOpacity>
	);

	getModifyButtons = () => (
		<>
			{this.getEditButton()}
			{this.getDeleteButton()}
		</>
	);

	getDeletionBackdrop = () => {
		const { deleting } = this.state;
		if (!deleting) return null;
		return (
			<View style={styles.deletionBackdrop}>
				<Text>Deleting Plant...</Text>
			</View>
		);
	};

	getFormattedDate = (date) => new Date(date).toDateString().substr(4, 12);

	isModerator = () => {
		const { userRole } = this.props;
		return userRole === config.roles.MODERATOR;
	};

	render() {
		const { centerBias } = this.state;
		const { selectedTree } = this.props;

		if (!selectedTree) {
			return <Text>Loading...</Text>;
		}

		const photo = selectedTree ? selectedTree.photo : null;
		const { health, location, lastActivityDate, owner, uploadedDate, plantType } = selectedTree;
		const { coordinates } = location;
		const [longitude, latitude] = coordinates;
		const formattedLastActivityDate = lastActivityDate && this.getFormattedDate(lastActivityDate);
		const formattedUploadedDate = uploadedDate && this.getFormattedDate(uploadedDate);
		// TODO: Change following with the proper implementation.
		const wateredPlant = Math.floor(Math.random() * 20);

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

				<View style={styles.heading}>
					<Text style={styles.plantType}>{plantType || 'Plant type not specified'}</Text>

					<View style={styles.modifyButtonContainer}>
						{this.isModerator() && this.getModifyButtons()}
					</View>
				</View>

				<View style={styles.treeDetailsContainer}>
					<ScrollView contentContainerStyle={styles.treeDetails}>
						{owner && owner.displayName && (
							<Text style={styles.distanceLabel}>Uploaded by : {owner.displayName}</Text>
						)}
						{formattedUploadedDate && (
							<Text style={styles.distanceLabel}>Created on {formattedUploadedDate}</Text>
						)}
						<View>
							{this.renderWeekStatus([
								{ key: 1, status: 'healthy' },
								{ key: 2, status: 'weak' },
								{ key: 3, status: 'weak' },
								{ key: 4, status: 'healthy' },
								{ key: 5, status: 'healthy' },
								{ key: 6, status: 'weak' },
								{ key: 7, status: 'weak' },
							])}
							<Text style={styles.lastWateredText}>
								Last watered on {formattedLastActivityDate}. Please don&apos;t forget to water me.
							</Text>
						</View>
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
						<Text style={styles.moreWateredHereText}>{wateredPlant} more have watered here</Text>
					</ScrollView>
				</View>
				<View style={styles.waterButtonContainer}>
					<Button
						style={{
							...styles.waterButton,
						}}
						success
						onPress={this.handleWaterTree}
					>
						<Text style={styles.waterButtonText}>WATERED</Text>
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
	mapView: { flex: 1.0, height: '100%' },
	treeDetailsContainer: {
		flex: 1.4,
	},
	treeDetails: {
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
	distanceLabel: {
		fontSize: 12,
		color: colors.gray,
	},
	weekStatus: { display: 'flex', flexDirection: 'row' },
	weekDot: { marginRight: 4, width: 12, height: 12, borderRadius: 6 },
	healthy: { backgroundColor: colors.green },
	adequate: { backgroundColor: colors.linkBlue },
	average: { backgroundColor: colors.yellow },
	weak: { backgroundColor: colors.orange },
	almostDead: { backgroundColor: colors.red },
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
	moreWateredHereText: { marginBottom: 40 },
});

const mapStateToProps = (state) => ({
	selectedTree: state.tree.selectedTree,
	userRole: state.auth.role,
});

const mapDispatchToProps = (dispatch) => ({
	waterTree: (tree) => dispatch(waterTree(tree)),
	deleteTree: (tree) => dispatch(deleteTree(tree)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TreeDetails);
