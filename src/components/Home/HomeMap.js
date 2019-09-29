import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';

import Map from '../Map/Map';
import Tree from '../Map/Tree';
import Spot from '../Map/Spot';
import PlantationSite from '../Map/PlantationSite';
import {
	fetchTreeGroups,
	setSelectedTree,
	setSelectedTreeGroup,
} from '../../store/actions/tree.action';
import {
	fetchPlanatationSites,
	setSelectedPlantationSite,
} from '../../store/actions/plantation-site.action';
import ApproveTreeGroupModal from '../../screens/ApproveTreeGroupModal';
import DeleteApproveTreeModal from '../../screens/DeleteApproveTreeModal';
import ApprovePlantationSiteModal from '../../screens/ApprovePlantationSiteModal';

import config from '../../config/common';
import { showNeedApproval } from '../../utils/PreDefinedToasts';

class HomeMap extends React.Component {
	constructor(props) {
		super(props);

		this.mapRef = React.createRef();
		this.state = {
			approveTreeGroupModal: { show: false, type: 'ADD' },
			approveTreeModal: { show: false, type: 'DELETE' },
			approveSiteModal: {
				show: false,
				type: 'ADD',
			},
		};
	}

	componentDidUpdate(prevProps) {
		const {
			currentHealthFilter: prevCurrentHealthFilter,
			currentRangeFilter: prevCurrentRangeFilter,
		} = prevProps;
		const { latitude: prevUserLat, longitude: prevUserLng } = prevProps.userLocation;

		const {
			userLocation,
			fetchTreeGroups,
			fetchPlanatationSites,
			currentRangeFilter,
			currentHealthFilter,
		} = this.props;

		const { latitude: userLatitude, longitude: userLongitude } = userLocation;

		const {
			healthy: prevHealthy,
			weak: prevWeak,
			almostDead: prevAlmostDead,
		} = prevCurrentHealthFilter;

		const { healthy, weak, almostDead } = currentHealthFilter;

		// prettier-ignore
		const healthFilterChanged = healthy !== prevHealthy || weak !== prevWeak || almostDead !== prevAlmostDead;
		// prettier-ignore
		const locationChanged = userLatitude !== prevUserLat || userLongitude !== prevUserLng;
		const rangeChanged = currentRangeFilter !== prevCurrentRangeFilter;

		if ((locationChanged || rangeChanged || healthFilterChanged) && this.mapRef) {
			const mapLocation = {
				latitude: userLatitude,
				longitude: userLongitude,
				latitudeDelta: 0.011582007226706992,
				longitudeDelta: 0.010652057826519012,
			};

			this.mapRef.animateToRegion(mapLocation, 2000);

			fetchTreeGroups(userLocation, currentRangeFilter * 1000, this.getAPIParamForHealth());

			fetchPlanatationSites(userLocation, currentRangeFilter * 1000);
		}
	}

	getAPIParamForHealth() {
		const { currentHealthFilter } = this.props;
		const { healthy, weak, almostDead } = currentHealthFilter;
		if (healthy && weak && almostDead) {
			return 'healthy,weak,almostDead';
		}
		if (healthy && almostDead) {
			return 'healthy,almostDead';
		}
		if (healthy && weak) {
			return 'healthy,weak';
		}
		if (weak && almostDead) {
			return 'weak,almostDead';
		}
		if (healthy) {
			return 'healthy';
		}
		if (weak) {
			return 'weak';
		}
		return 'almostDead';
	}

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
				this.setState({ approveTreeModal: { show: true, type: 'DELETE' } });
				break;
			default:
				setSelectedTree(tree);
				navigation.navigate('TreeDetails');
		}
	}

	selectTreeGroup(treeGroup) {
		const { moderatorApproved } = treeGroup;
		const deleteObject = treeGroup.delete;
		const deleteNotApproved =
			deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;

		const { navigation, setSelectedTreeGroup } = this.props;

		switch (true) {
			case (!moderatorApproved || deleteNotApproved) && !this.isModerator():
				showNeedApproval();
				break;
			case !moderatorApproved && this.isModerator():
				setSelectedTreeGroup(treeGroup);
				this.setState({ approveTreeGroupModal: { show: true, type: 'ADD' } });
				break;
			case deleteNotApproved && this.isModerator():
				setSelectedTreeGroup(treeGroup);
				this.setState({ approveTreeGroupModal: { show: true, type: 'DELETE' } });
				break;
			default:
				console.log(
					'Do nothing for now and think about following uncommented part in the code later.'
				);
				setSelectedTreeGroup(treeGroup);
				navigation.navigate('TreeGroupDetails');
		}
	}

	selectPlantationSite(plantationSite) {
		const { moderatorApproved } = plantationSite;
		const deleteObject = plantationSite.delete;
		const deleteNotApproved =
			deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;
		const { navigation, setSelectedPlantationSite } = this.props;

		switch (true) {
			case (!moderatorApproved || deleteNotApproved) && !this.isModerator():
				showNeedApproval();
				break;
			case !moderatorApproved && this.isModerator():
				setSelectedPlantationSite(plantationSite);
				this.setState({ approveSiteModal: { show: true, type: 'ADD' } });
				break;
			case deleteNotApproved && this.isModerator():
				setSelectedPlantationSite(plantationSite);
				this.setState({ approveSiteModal: { show: true, type: 'DELETE' } });
				break;
			default:
				setSelectedPlantationSite(plantationSite);
				navigation.navigate('PlantationSiteDetails');
		}
	}

	isModerator = () => {
		const { userRole } = this.props;
		return userRole === config.roles.MODERATOR;
	};

	closeApproveTreeGroupModal = () => {
		this.setState((state) => ({
			...state,
			approveTreeGroupModal: { ...state.approveTreeGroupModal, show: false },
		}));
	};

	closeApproveTreeModal = () => {
		this.setState((state) => ({
			...state,
			approveTreeModal: { ...state.approveTreeModal, show: false },
		}));
	};

	closeApproveSiteModal = () => {
		this.setState((state) => ({
			...state,
			approveSiteModal: { ...state.approveSiteModal, show: false },
		}));
	};

	getDeleteStatus = (data) => {
		const deleteObject = data.delete;
		return deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;
	};

	renderTrees = (data) => {
		if (data.trees.length === 1) {
			const deleteNotApproved = this.getDeleteStatus(data);

			return (
				<Tree
					key={data.trees[0]._id}
					coordinate={data.location}
					onPress={() => {
						this.selectTree(data.trees[0]);
					}}
					status={data.trees[0].health}
					deleteNotApproved={deleteNotApproved}
				/>
			);
		}

		const deleteNotApproved = this.getDeleteStatus(data);

		return (
			<Spot
				key={data.id}
				coordinate={data.location}
				onPress={() => {
					this.selectTreeGroup(data);
				}}
				health={data.health}
				treeCount={data.trees.length}
				notApproved={!data.moderatorApproved}
				deleteNotApproved={deleteNotApproved}
			/>
		);
	};

	renderPlantationSites = (site) => {
		const deleteNotApproved = this.getDeleteStatus(site);

		return (
			<PlantationSite
				key={site.id}
				coordinate={site.location}
				onPress={() => {
					this.selectPlantationSite(site);
				}}
				notApproved={!site.moderatorApproved}
				deleteNotApproved={deleteNotApproved}
			/>
		);
	};

	render() {
		const { userLocation, treeGroups, plantationSites } = this.props;
		const { approveSiteModal, approveTreeGroupModal, approveTreeModal } = this.state;

		const { latitude, longitude } = userLocation;
		const { onMapLoad } = this.props;

		const treeData = treeGroups.map((treeGroup) => {
			const { _id, health, location, ...rest } = treeGroup;
			const { coordinates } = location;
			return {
				id: _id,
				health,
				location: { longitude: coordinates[0], latitude: coordinates[1] },
				...rest,
			};
		});

		const plantationSiteData = plantationSites.map((site) => {
			const { _id, location, ...rest } = site;
			const { coordinates } = location;
			return {
				id: _id,
				location: { longitude: coordinates[0], latitude: coordinates[1] },
				...rest,
			};
		});

		return (
			<Container style={styles.container}>
				<Map
					onMapLoad={(ref) => {
						this.mapRef = ref;
						onMapLoad(ref);
					}}
					initialRegion={{
						latitude,
						longitude,
						latitudeDelta: 0.011582007226706992,
						longitudeDelta: 0.010652057826519012,
					}}
					showsUserLocation
					followsUserLocation
					showsCompass={false}
					showsMyLocationButton={false}
				>
					{treeData.map((treeGroup) => this.renderTrees(treeGroup))}
					{plantationSiteData.map((site) => this.renderPlantationSites(site))}
				</Map>

				{approveTreeGroupModal.show && (
					<ApproveTreeGroupModal
						visible={approveTreeGroupModal.show}
						approveType={approveTreeGroupModal.type}
						onClose={this.closeApproveTreeGroupModal}
					/>
				)}
				{approveTreeModal.show && (
					<DeleteApproveTreeModal
						visible={approveTreeModal.show}
						onClose={this.closeApproveTreeModal}
					/>
				)}
				{approveSiteModal.show && (
					<ApprovePlantationSiteModal
						visible={approveSiteModal.show}
						approveType={approveSiteModal.type}
						onClose={this.closeApproveSiteModal}
					/>
				)}
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
});

HomeMap.propTypes = {
	userLocation: PropTypes.shape({
		latitude: PropTypes.number.isRequired,
		longitude: PropTypes.number.isRequired,
	}).isRequired,
};

HomeMap.defaultProps = {};

const mapStateToProps = (state) => ({
	userLocation: state.location.userLocation,
	treeGroups: state.tree.treeGroups,
	plantationSites: state.plantationSite.plantationSites,
	isTreeDetailsOpen: state.ui.isTreeDetailsOpen,
	userRole: state.auth.role,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedTree: (tree) => dispatch(setSelectedTree(tree)),
	setSelectedPlantationSite: (tree) => dispatch(setSelectedPlantationSite(tree)),
	setSelectedTreeGroup: (spot) => dispatch(setSelectedTreeGroup(spot)),
	fetchTreeGroups: (...param) => dispatch(fetchTreeGroups(...param)),
	fetchPlanatationSites: (...param) => dispatch(fetchPlanatationSites(...param)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeMap);
