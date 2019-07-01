import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { View, Text, Container, Button } from 'native-base';
// import { MaterialIcons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { toggleTreeDetails } from '../../store/actions/ui-interactions.action';
import { waterTree, deleteTree, resetSelectedTreeDetails } from '../../store/actions/tree.action';

class TreeDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			waterButton: {
				disabled: false,
				text: 'WATERED',
			},
		};
	}

	renderWeekStatus = (weekStatus) => {
		return (
			<View style={styles.weekStatus}>
				{weekStatus.map((aWeek) => (
					<View key={aWeek.key} style={{ ...styles.weekDot, ...styles[aWeek.status] }} />
				))}
			</View>
		);
	};

	updateWaterButton = (props) => {
		this.setState({ waterButton: { ...props } });
	};

	waterTree = () => {
		this.updateWaterButton({ disabled: true, text: 'please wait...' });
		const { tree } = this.props;
		const treeWatered = tree.selectedTreeDetails;
		console.log(`[TreeDetails.js::waterTree] watering tree with id "${treeWatered._id}"`);
		// I am sorry I am doing eslint disable for this one. Don't tell anyone. Shhhh....
		// eslint-disable-next-line react/destructuring-assignment
		this.props.waterTree(treeWatered);
	};

	deletePlantConfirmed = () => {
		const { deleteTree, tree, toggleTreeDetails, resetSelectedTreeDetails } = this.props;
		const treeToDelete = tree.selectedTreeDetails;
		deleteTree(treeToDelete);
		toggleTreeDetails();
		resetSelectedTreeDetails();
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
	getDeleteButton = () => {
		return (
			<TouchableOpacity style={styles.deleteButton} onPress={this.showConfirmDeleteAlert}>
				<MaterialIcons name="delete" size={24} color="red" />
			</TouchableOpacity>
		);
	};

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
		const { waterButton } = this.state;
		const { tree } = this.props;
		const { selectedTreeDetails } = tree;
		const photo = selectedTreeDetails ? selectedTreeDetails.photo : null;

		return (
			<Container style={styles.container}>
				<View style={styles.content}>
					<View style={styles.heading}>
						<View style={styles.plantHeading}>
							<Text style={styles.addressLabel}>Two Stones</Text>
							<Text style={styles.distanceLabel}>1.3 km FROM HOME</Text>
						</View>
						{this.getDeleteButton()}
					</View>
					<View style={styles.weekStatusContainer}>
						{this.renderWeekStatus([
							{ key: 1, status: 'healthy' },
							{ key: 2, status: 'healthy' },
							{ key: 3, status: 'healthy' },
							{ key: 4, status: 'healthy' },
							{ key: 5, status: 'healthy' },
							{ key: 6, status: 'healthy' },
							{ key: 7, status: 'healthy' },
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
						style={{ ...styles.wateredButton, opacity: waterButton.disabled ? 0.4 : 1 }}
						/**
						 * For some reason, the button does not look 'disabled'
						 * even if waterButton.disabled is true :/
						 * Akshay: Yeah, that's the case with native-base or react-native component.
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
		width: '100%',
		paddingRight: 16,
		paddingLeft: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
	},
	heading: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
	addressLabel: { fontSize: 20, textAlignVertical: 'bottom', paddingRight: 8 },
	distanceLabel: { fontSize: 12, color: 'gray', textAlignVertical: 'bottom' },
	weekStatus: { display: 'flex', flexDirection: 'row' },
	weekStatusContainer: {},
	weekDot: { marginRight: 4, width: 12, height: 12, borderRadius: 6 },
	healthy: { backgroundColor: 'green' },
	weak: { backgroundColor: 'orange' },
	almostDead: { backgroundColor: 'red' },
	lastWateredText: { fontSize: 12, color: 'gray' },
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
	},
	imageNotFoundText: { textAlign: 'center' },
});

const mapStateToProps = (state) => ({
	tree: state.tree,
	user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
	waterTree: (tree) => dispatch(waterTree(tree)),
	deleteTree: (tree) => dispatch(deleteTree(tree)),
	resetSelectedTreeDetails: () => dispatch(resetSelectedTreeDetails()),
	toggleTreeDetails: () => dispatch(toggleTreeDetails()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TreeDetails);
