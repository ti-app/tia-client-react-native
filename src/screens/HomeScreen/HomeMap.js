import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';

import Map from '../../shared/Map/MapView/MapView';
import Tree from '../../shared/Map/Tree/Tree';
import Spot from '../../shared/Map/Spot/Spot';
import PlantationSite from '../../shared/Map/PlantationSite/PlantationSite';
import * as treeActions from '../../store/actions/tree.action';
import * as plantationSiteActions from '../../store/actions/plantation-site.action';
import ApproveTreeGroupModal from '../ApproveModals/ApproveTreeGroupModal';
import DeleteApproveTreeModal from '../ApproveModals/DeleteApproveTreeModal';
import ApprovePlantationSiteModal from '../ApproveModals/ApprovePlantationSiteModal';
import config from '../../config/common';
import { showNeedApproval } from '../../utils/predefinedToasts';
import { usePrevious } from '../../utils/customHooks';
import { selectUserLocation } from '../../store/reducers/location.reducer';
import { selectTreeGroups } from '../../store/reducers/tree.reducer';
import { selectPlantationSites } from '../../store/reducers/plantation-site.reducer';
import { selectUserRole } from '../../store/reducers/auth.reducer';

const HomeMap = ({ currentRangeFilter, currentStatusList, navigation, onMapLoad }) => {
	const [mapRef, setMapRef] = useState(null);
	const [approveTreeGroupModal, setApproveTreeGroupModal] = useState({ show: false, type: 'ADD' });
	const [approveTreeModal, setApproveTreeModal] = useState({ show: false, type: 'DELETE' });
	const [approveSiteModal, setApproveSiteModal] = useState({ show: false, type: 'ADD' });

	const userLocation = useSelector(selectUserLocation);
	const treeGroups = useSelector(selectTreeGroups);
	const plantationSites = useSelector(selectPlantationSites);
	const userRole = useSelector(selectUserRole);

	const prevCurrentStatusList = usePrevious(currentStatusList);
	const prevCurrentRangeFilter = usePrevious(currentRangeFilter);
	const prevUserLocation = usePrevious(userLocation);

	const dispatch = useDispatch();
	const fetchTreeGroups = useCallback(
		(...param) => dispatch(treeActions.fetchTreeGroups(...param)),
		[dispatch]
	);
	const setSelectedTree = useCallback((tree) => dispatch(treeActions.setSelectedTree(tree)), [
		dispatch,
	]);
	const setSelectedTreeGroup = useCallback(
		(spot) => dispatch(treeActions.setSelectedTreeGroup(spot)),
		[dispatch]
	);
	const fetchPlanatationSites = useCallback(
		(...param) => dispatch(plantationSiteActions.fetchPlanatationSites(...param)),
		[dispatch]
	);
	const setSelectedPlantationSite = useCallback(
		(site) => dispatch(plantationSiteActions.setSelectedPlantationSite(site)),
		[dispatch]
	);

	useEffect(() => {
		let forcedUpdate = false;
		let healthFilterChanged = false;
		let locationChanged = false;
		let rangeChanged = false;

		const { latitude: userLatitude, longitude: userLongitude } = userLocation;

		if (!prevUserLocation || !prevCurrentStatusList || !prevCurrentRangeFilter) {
			forcedUpdate = true;
		} else {
			const { latitude: prevUserLat, longitude: prevUserLng } = prevUserLocation;

			healthFilterChanged =
				JSON.stringify(prevCurrentStatusList) !== JSON.stringify(currentStatusList);
			locationChanged = userLatitude !== prevUserLat || userLongitude !== prevUserLng;
			rangeChanged = currentRangeFilter !== prevCurrentRangeFilter;
		}

		if ((forcedUpdate || locationChanged || rangeChanged || healthFilterChanged) && mapRef) {
			fetchTreeGroups(userLocation, currentRangeFilter * 1000, currentStatusList.join(','));

			fetchPlanatationSites(userLocation, currentRangeFilter * 1000);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userLocation, currentStatusList, currentRangeFilter]);

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
				setApproveTreeModal({ show: true, type: 'DELETE' });
				break;
			default:
				setSelectedTree(tree);
				navigation.navigate('TreeDetails');
		}
	};

	const selectTreeGroup = (_treeGroup) => {
		const { moderatorApproved } = _treeGroup;
		const deleteObject = _treeGroup.delete;
		const deleteNotApproved =
			deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;

		switch (true) {
			case (!moderatorApproved || deleteNotApproved) && !isModerator():
				showNeedApproval();
				break;
			case !moderatorApproved && isModerator():
				setSelectedTreeGroup(_treeGroup);
				setApproveTreeGroupModal({ show: true, type: 'ADD' });
				break;
			case deleteNotApproved && isModerator():
				setSelectedTreeGroup(_treeGroup);
				setApproveTreeGroupModal({ show: true, type: 'DELETE' });
				break;
			default:
				setSelectedTreeGroup(_treeGroup);
				navigation.navigate('TreeGroupDetails');
		}
	};

	const selectPlantationSite = (_plantationSite) => {
		const { moderatorApproved } = _plantationSite;
		const deleteObject = _plantationSite.delete;
		const deleteNotApproved =
			deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;

		switch (true) {
			case (!moderatorApproved || deleteNotApproved) && !isModerator():
				showNeedApproval();
				break;
			case !moderatorApproved && isModerator():
				setSelectedPlantationSite(_plantationSite);
				setApproveSiteModal({ show: true, type: 'ADD' });
				break;
			case deleteNotApproved && isModerator():
				setSelectedPlantationSite(_plantationSite);
				setApproveSiteModal({ show: true, type: 'DELETE' });
				break;
			default:
				setSelectedPlantationSite(_plantationSite);
				navigation.navigate('PlantationSiteDetails');
		}
	};

	const isModerator = () => {
		return userRole === config.roles.MODERATOR;
	};

	const closeApproveTreeGroupModal = () => {
		setApproveTreeGroupModal((_approveTreeGroupModal) => ({
			..._approveTreeGroupModal,
			show: false,
		}));
	};

	const closeApproveTreeModal = () => {
		setApproveTreeModal((_approveTreeModal) => ({
			..._approveTreeModal,
			show: false,
		}));
	};

	const closeApproveSiteModal = () => {
		setApproveSiteModal((_approveSiteModal) => ({
			..._approveSiteModal,
			show: false,
		}));
	};

	const getDeleteStatus = (_data) => {
		const deleteObject = _data.delete;
		return deleteObject && deleteObject.deleted && !deleteObject.isModeratorApproved;
	};

	const renderTrees = (_data) => {
		if (_data.trees.length === 1) {
			const deleteNotApproved = getDeleteStatus(_data);

			return (
				<Tree
					key={_data.trees[0]._id}
					coordinate={_data.location}
					onPress={() => {
						selectTree(_data.trees[0]);
					}}
					status={_data.trees[0].health}
					deleteNotApproved={deleteNotApproved}
				/>
			);
		}

		const deleteNotApproved = getDeleteStatus(_data);

		return (
			<Spot
				key={_data.id}
				coordinate={_data.location}
				onPress={() => {
					selectTreeGroup(_data);
				}}
				health={_data.health}
				treeCount={_data.trees.length}
				notApproved={!_data.moderatorApproved}
				deleteNotApproved={deleteNotApproved}
			/>
		);
	};

	const renderPlantationSites = (_site) => {
		const deleteNotApproved = getDeleteStatus(_site);

		return (
			<PlantationSite
				key={_site.id}
				coordinate={_site.location}
				onPress={() => {
					selectPlantationSite(_site);
				}}
				notApproved={!_site.moderatorApproved}
				deleteNotApproved={deleteNotApproved}
			/>
		);
	};

	const { latitude, longitude } = userLocation;

	const treeData = treeGroups.map((_treeGroup) => {
		const { _id, health, location, ...rest } = _treeGroup;
		const { coordinates } = location;
		return {
			id: _id,
			health,
			location: { longitude: coordinates[0], latitude: coordinates[1] },
			...rest,
		};
	});

	const plantationSiteData = plantationSites.map((_site) => {
		const { _id, location, ...rest } = _site;
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
					setMapRef(ref);
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
				{treeData.map((treeGroup) => renderTrees(treeGroup))}
				{plantationSiteData.map((site) => renderPlantationSites(site))}
			</Map>

			{approveTreeGroupModal.show && (
				<ApproveTreeGroupModal
					visible={approveTreeGroupModal.show}
					approveType={approveTreeGroupModal.type}
					onClose={closeApproveTreeGroupModal}
				/>
			)}
			{approveTreeModal.show && (
				<DeleteApproveTreeModal visible={approveTreeModal.show} onClose={closeApproveTreeModal} />
			)}
			{approveSiteModal.show && (
				<ApprovePlantationSiteModal
					visible={approveSiteModal.show}
					approveType={approveSiteModal.type}
					onClose={closeApproveSiteModal}
				/>
			)}
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
});

HomeMap.propTypes = {};

HomeMap.defaultProps = {};

export default HomeMap;
