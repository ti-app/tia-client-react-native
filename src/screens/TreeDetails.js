import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { View, Text, Container, Button } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';

import { waterTree, deleteTree } from '../store/actions/tree.action';
import Tree from '../components/Map/Tree';
import TreeDetailsNavBar from '../components/Navigation/TreeDetailsNavBar';
import * as colors from '../styles/colors';

class TreeDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			waterButton: {
				disabled: false,
				text: 'WATERED',
			},
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

	updateWaterButton = (props) => {
		this.setState({ waterButton: { ...props } });
	};

	waterTree = () => {
		this.updateWaterButton({ disabled: true, text: 'please wait...' });
		const { selectedTreeDetails, waterTree } = this.props;
		const treeWatered = selectedTreeDetails;
		waterTree(treeWatered);
	};

	deletePlantConfirmed = () => {
		const { deleteTree, selectedTreeDetails } = this.props;
		const treeToDelete = selectedTreeDetails;
		deleteTree(treeToDelete);
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

	/**
	 * TODO:
	 * Rather than just rendering the delete button for all the users,
	 * First check if the user logged in has enough authorization to delete the plant
	 * If he is the OWNER or MODERATOR, he should be able to delete it.
	 * Other wise, do not render the delete button
	 */
	getDeleteButton = () => (
		<TouchableOpacity style={styles.deleteButton} onPress={this.showConfirmDeleteAlert}>
			<MaterialIcons name="delete" size={24} color={colors.red.toString()} />
		</TouchableOpacity>
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

	render() {
		const { waterButton, centerBias } = this.state;
		const { selectedTreeDetails } = this.props;

		if (!selectedTreeDetails) {
			return <Text>Loading...</Text>;
		}

		const photo = selectedTreeDetails ? selectedTreeDetails.photo : null;
		const { health, location } = selectedTreeDetails;
		const { coordinates } = location;
		const [longitude, latitude] = coordinates;

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
				<View style={styles.treeDetails}>
					<View style={styles.heading}>
						<View style={styles.plantHeading}>
							<Text style={styles.addressLabel}>Two Stones</Text>
							<Text style={styles.distanceLabel}>1.3 km FROM HOME</Text>
						</View>
						{this.getDeleteButton()}
					</View>
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
						<Text style={styles.lastWateredText}>LAST WATERED ON 05/10/2018 05:55 PM</Text>
					</View>
					{photo && photo.length > 0 ? (
						<Image
							source={{
								uri: selectedTreeDetails.photo,
							}}
							resizeMode="contain"
							style={{ width: '100%', height: 200 }}
						/>
					) : (
						<View style={styles.imageNotFound}>
							<Text style={styles.imageNotFoundText}>No Image.</Text>
						</View>
					)}
					<Text>82 more have watered here</Text>
					<Button
						style={{
							...styles.wateredButton,
							opacity: waterButton.disabled ? 0.4 : 1,
						}}
						/**
						 * Anand: For some reason, the button does not look 'disabled'
						 * even if waterButton.disabled is true :/
						 * Akshay: Yeah, apparently that's the case with native-base or react-native component.
						 * So I've added opacity to make it look disabled.
						 */
						disabled={waterButton.disabled}
						success
						onPress={this.waterTree}
					>
						<Text style={styles.wateredButtonText}> {waterButton.text} </Text>
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
	treeDetails: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingRight: 16,
		paddingLeft: 16,
		paddingTop: 8,
		paddingBottom: 16,
		flex: 1.4,
	},
	heading: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	addressLabel: { fontSize: 20, textAlignVertical: 'bottom', paddingRight: 8 },
	distanceLabel: {
		fontSize: 12,
		color: colors.gray,
		textAlignVertical: 'bottom',
	},
	weekStatus: { display: 'flex', flexDirection: 'row' },
	weekDot: { marginRight: 4, width: 12, height: 12, borderRadius: 6 },
	healthy: { backgroundColor: colors.green },
	weak: { backgroundColor: colors.orange },
	almostDead: { backgroundColor: colors.red },
	lastWateredText: { fontSize: 12, color: colors.gray },
	wateredButton: {
		width: '100%',
		paddingRight: 8,
		paddingLeft: 8,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	plantHeading: {
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
	},
	deleteButton: {
		padding: 8,
		borderColor: 'black',
	},
	wateredButtonText: { textAlign: 'center' },
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

const mapStateToProps = (state) => ({
	selectedTreeDetails: state.tree.selectedTreeDetails,
	user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
	waterTree: (tree) => dispatch(waterTree(tree)),
	deleteTree: (tree) => dispatch(deleteTree(tree)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TreeDetails);
