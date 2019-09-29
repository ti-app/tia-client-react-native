import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { View, Text, Container, Button } from 'native-base';
import MapView from 'react-native-maps';

import OptionsBar from '../components/Navigation/OptionsBar';
import * as colors from '../styles/colors';
import config from '../config/common';
import Tree from '../components/Map/Tree';
import { showNeedApproval } from '../utils/PreDefinedToasts';
import { setSelectedTree } from '../store/actions/tree.action';

class TreeGroupDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			centerBias: 0.000075,
		};
	}

	static navigationOptions = ({ navigation }) => {
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

	handleWaterTreeGroup = () => {
		// const { selectedTreeGroup, waterTreeGroup } = this.props;
		// waterTreeGroup(selectedTreeGroup);
	};

	getFormattedDate = (date) => new Date(date).toDateString().substr(4, 12);

	isModerator = () => {
		const { userRole } = this.props;
		return userRole === config.roles.MODERATOR;
	};

	selectTree(tree) {
		const deleteObject = tree.delete;
		const deleteNotApproved =
			deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;

		const { navigation, setSelectedTree } = this.props;

		switch (true) {
			case deleteNotApproved && !this.isModerator():
				showNeedApproval();
				break;
			case deleteNotApproved && this.isModerator():
				setSelectedTree(tree);
				// this.setState({ approveTreeModal: { show: true, approveType: 'DELETE' } }); TODO: Put this in redux state and make it work
				break;
			default:
				setSelectedTree(tree);
				navigation.navigate('TreeDetails');
		}
	}

	// TODO: For now it will show trees radially with manual calculation, refactor later to show with the exact lat lng of trees.
	renderTrees = (trees, location) => {
		const division = 360 / trees.length;
		const radius = 0.00003;
		const { longitude: centerLng, latitude: centerLat } = location;

		return trees.map((tree, i) => {
			const modifiedLng = centerLng + Math.cos(division * (i + 1) * (Math.PI / 180)) * radius;
			const modifiedLat = centerLat + Math.sin(division * (i + 1) * (Math.PI / 180)) * radius;
			const deleteObject = tree.delete;

			return (
				<Tree
					key={tree._id}
					coordinate={{ longitude: modifiedLng, latitude: modifiedLat }}
					onPress={() => {
						this.selectTree(tree);
					}}
					status={tree.health}
					deleteNotApproved={
						deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved
					}
				/>
			);
		});
	};

	render() {
		const { centerBias } = this.state;
		const { selectedTreeGroup } = this.props;

		if (!selectedTreeGroup) {
			return <Text>Loading...</Text>;
		}

		const {
			location,
			owner,
			uploadedDate,
			plantType,
			photo,
			plants,
			lastActivityDate,
			trees,
		} = selectedTreeGroup;

		const { longitude, latitude } = location;
		const formattedLastActivityDate = lastActivityDate && this.getFormattedDate(lastActivityDate);
		const formattedUploadedDate = uploadedDate && this.getFormattedDate(uploadedDate);

		return (
			<Container style={styles.container}>
				<View style={styles.mapView}>
					<MapView
						style={styles.mapView}
						initialRegion={{
							latitude: latitude + centerBias, // Added bias for center of map to align it properly in the viewport, temporary solution. TODO: Think of better way.
							longitude,
							latitudeDelta: 0.000292007226706992,
							longitudeDelta: 0.000125057826519012,
						}}
						scrollEnabled={false}
						pitchEnabled={false}
						rotateEnabled={false}
						zoomEnabled={false}
					>
						{this.renderTrees(trees, location)}
					</MapView>
				</View>

				<View style={styles.heading}>
					<Text style={styles.plantType}>{plantType || 'Plant type not specified'}</Text>
				</View>

				<View style={styles.treeDetailsGroupContainer}>
					<ScrollView contentContainerStyle={styles.treeDetailsGroup}>
						<Text style={styles.treeGroupInfo}>Number of plants: {plants}</Text>
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
						onPress={this.handleWaterTreeGroup}
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

const mapStateToProps = (state) => ({
	selectedTreeGroup: state.tree.selectedTreeGroup,
	userRole: state.auth.role,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedTree: (tree) => dispatch(setSelectedTree(tree)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TreeGroupDetails);
