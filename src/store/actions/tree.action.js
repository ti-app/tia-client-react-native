import { Toast } from 'native-base';

import apiClient from '../../utils/apiClient';
import { showErrorToast } from '../../utils/predefinedToasts';
import NavigationUtil from '../../utils/navigation';
import { checkIfOutOfRange } from '../../utils/geo';
import uuid from '../../utils/uuid';
import logger from '../../utils/logger';

export const ADD_TREE_GROUP = 'ADD_TREE_GROUP';
export const ADD_TREE_GROUP_COMMIT = 'ADD_TREE_GROUP_COMMIT';
export const ADD_TREE_GROUP_ROLLBACK = 'ADD_TREE_GROUP_ROLLBACK';
export const WATER_TREE = 'WATER_TREE';
export const WATER_TREE_ROLLBACK = 'WATER_TREE_ROLLBACK';
export const WATER_TREE_GROUP = 'WATER_TREE_GROUP';
export const WATER_TREE_GROUP_ROLLBACK = 'WATER_TREE_GROUP_ROLLBACK';
export const SET_NEW_TREE_GROUP = 'SET_NEW_TREE_GROUP';
export const RESET_NEW_TREE_GROUP = 'RESET_NEW_TREE_GROUP';
export const FETCH_TREE = 'FETCH_TREE';
export const FETCH_TREE_GROUP_SUCCESS = 'FETCH_TREE_GROUP_SUCCESS';
export const SET_SELECTED_TREE_DETAILS = 'SET_SELECTED_TREE_DETAILS';
export const RESET_SELECTED_TREE_DETAILS = 'RESET_SELECTED_TREE_DETAILS';
export const SET_SELECTED_TREE_GROUP = 'SET_SELECTED_TREE_GROUP';
export const RESET_SELECTED_TREE_GROUP = 'RESET_SELECTED_TREE_GROUP';

export const dispatchFetchTreeGroupsAction = (dispatch, getState) => {
	const state = getState();
	const {
		location: { homeMapCenter },
		ui: { currentStatusList, currentRangeFilter },
	} = state;

	dispatch(
		fetchTreeGroups(
			{
				...homeMapCenter,
			},
			currentRangeFilter * 1000,
			currentStatusList.join(',')
		)
	);
};

// /**
//  * Accepts parameter treeGroup which should be a FormData including an Image.
//  * @param {FormData} treeGroup
//  */
// export const addGroup = (treeGroup) => async (dispatch, getState) => {
// 	try {
// 		await apiClient({
// 			method: 'post',
// 			url: '/tree_group',
// 			data: treeGroup,
// 			headers: {
// 				Accept: 'application/json',
// 				'content-type': 'multipart/form-data',
// 			},
// 		});

// 		NavigationUtil.navigate('Home');
// 		dispatchFetchTreeGroupsAction(dispatch, getState);
// 	} catch (err) {
// 		showErrorToast('Error adding a tree group.');
// 	}
// };

export const addGroup = () => (dispatch, getState) => {
	const _uuid = uuid();
	const { role, user } = getState().auth;
	const { newTreeGroup } = getState().tree;

	NavigationUtil.navigate('Home');

	const { trees } = newTreeGroup;

	const treeGroupData = {
		...newTreeGroup,
		trees: JSON.stringify(
			trees.map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude }))
		),
	};

	dispatch({
		type: ADD_TREE_GROUP,
		payload: { treeGroup: newTreeGroup, tempUuid: _uuid, user, role },
		meta: {
			offline: {
				effect: {
					method: 'post',
					url: '/tree_group',
					data: treeGroupData,
					headers: {
						Accept: 'application/json',
						'content-type': 'multipart/form-data',
					},
				},
				commit: { type: ADD_TREE_GROUP_COMMIT, meta: { tempUuid: _uuid } },
				rollback: { type: ADD_TREE_GROUP_ROLLBACK, meta: { tempUuid: _uuid } },
			},
		},
	});
};

export const fetchTreeGroups = (
	location,
	radius = 500,
	health = 'healthy,adequate,average,weak,almostDead'
) => async (dispatch, getState) => {
	try {
		const { latitude: lat, longitude: lng } = location;

		const state = getState();
		const {
			location: { userLocation },
		} = state;

		const { latitude: userLat, longitude: userLng } = userLocation;

		const response = await apiClient({
			url: '/tree_group',
			params: {
				lat,
				lng,
				radius,
				health,
				user_location: userLat === lat && userLng === lng,
			},
			headers: {
				'content-type': 'application/json',
			},
			data: { noloading: true },
		});
		dispatch(fetchTreeGroupsSuccess(response.data));
		dispatch(resetNewTreeGroupData());
		Toast.show({
			text: 'Getting nearby plants.',
			duration: 2000,
			textStyle: {
				textAlign: 'center',
			},
		});
	} catch (error) {
		showErrorToast('Error fetching nearby trees.');
		logger.logError(error, 'Error fetching nearby trees');
	}
};

export const updateTree = (treeId, updatedTree) => async (dispatch, getState) => {
	if (checkIfOutOfRange(getState)) {
		return;
	}

	try {
		await apiClient({
			method: 'put',
			url: `/tree/${treeId}`,
			data: updatedTree,
			headers: {
				Accept: 'application/json',
				'content-type': 'multipart/form-data',
			},
		});

		NavigationUtil.navigate('Home');
		dispatchFetchTreeGroupsAction(dispatch, getState);
	} catch (error) {
		showErrorToast('Error updating a tree.');
		logger.logError(error, 'Error updating a tree');
	}
};

export const waterTree = (tree) => async (dispatch, getState) => {
	if (checkIfOutOfRange(getState)) {
		return;
	}

	const { _id: treeId, health, groupId: treeGroupId } = tree;

	NavigationUtil.navigate('Home');

	Toast.show({
		text: 'Successfully updated watering details',
		duration: 1000,
		textStyle: {
			textAlign: 'center',
		},
	});

	dispatch({
		type: WATER_TREE,
		payload: { treeGroupId, treeId },
		meta: {
			offline: {
				effect: {
					method: 'get',
					url: `/tree/${treeId}/water`,
					headers: {
						Accept: 'application/json',
					},
				},
				rollback: { type: WATER_TREE_ROLLBACK, meta: { treeGroupId, treeId, prevHealth: health } },
			},
		},
	});
};

export const waterTreeGroup = (treeGroup) => async (dispatch, getState) => {
	if (checkIfOutOfRange(getState)) {
		return;
	}

	const { _id: treeGroupId, health } = treeGroup;

	Toast.show({
		text: 'Successfully updated watered tree group',
		duration: 1000,
		textStyle: {
			textAlign: 'center',
		},
	});

	NavigationUtil.navigate('Home');

	dispatch({
		type: WATER_TREE_GROUP,
		payload: { treeGroupId },
		meta: {
			offline: {
				effect: {
					method: 'get',
					url: `/tree_group/${treeGroupId}/water`,
					headers: {
						Accept: 'application/json',
					},
				},
				rollback: { type: WATER_TREE_GROUP_ROLLBACK, meta: { treeGroupId, prevHealth: health } },
			},
		},
	});
};

export const deleteTree = (tree) => async (dispatch, getState) => {
	try {
		const { _id } = tree;
		const url = `/tree/${_id}`;
		await apiClient({
			url,
			headers: {
				'content-type': 'application/json',
			},
			method: 'DELETE',
		});
		Toast.show({
			text: 'Tree was successfully deleted',
			duration: 1000,
			textStyle: {
				textAlign: 'center',
			},
		});

		NavigationUtil.navigate('Home');
		dispatchFetchTreeGroupsAction(dispatch, getState);
	} catch (error) {
		showErrorToast('Error deleting the tree.');
		logger.logError(error, 'Error deleting the tree');
	}
};

export const deleteTreeGroup = (treeGroup) => async (dispatch, getState) => {
	try {
		const { _id } = treeGroup;
		const url = `/tree_group/${_id}`;
		await apiClient({
			url,
			headers: {
				'content-type': 'application/json',
			},
			method: 'DELETE',
		});
		Toast.show({
			text: 'Tree group was successfully deleted',
			duration: 1000,
			textStyle: {
				textAlign: 'center',
			},
		});

		NavigationUtil.navigate('Home');

		dispatchFetchTreeGroupsAction(dispatch, getState);
	} catch (error) {
		showErrorToast('Error deleting the tree group');
		logger.logError(error, 'Error deleting the tree group');
	}
};

export const takeModActionForTreeGroup = (treeGroupId, approval) => async (dispatch, getState) => {
	try {
		const url = `/tree_group/${treeGroupId}/mod-action`;
		await apiClient({
			url,
			method: 'patch',
			headers: {
				'content-type': 'application/json',
			},
			data: approval,
		});
		Toast.show({
			text: 'Successfully taken action',
			duration: 1000,
			textStyle: {
				textAlign: 'center',
			},
		});

		NavigationUtil.navigate('Home');

		dispatchFetchTreeGroupsAction(dispatch, getState);
	} catch (error) {
		showErrorToast('Error taking action');
		logger.logError(error, 'Error taking moderator action on tree group');
	}
};

export const takeModActionForTree = (treeId, approval) => async (dispatch, getState) => {
	try {
		const url = `/tree/${treeId}/mod-action`;
		await apiClient({
			url,
			method: 'patch',
			headers: {
				'content-type': 'application/json',
			},
			data: approval,
		});
		Toast.show({
			text: 'Successfully taken action',
			duration: 1000,
			textStyle: {
				textAlign: 'center',
			},
		});

		NavigationUtil.navigate('Home');
		dispatchFetchTreeGroupsAction(dispatch, getState);
	} catch (error) {
		showErrorToast('Error taking action');
		logger.logError(error, 'Error taking moderator action on tree');
	}
};

export const fetchTreeGroupsSuccess = (payload) => ({
	type: FETCH_TREE_GROUP_SUCCESS,
	payload,
});

export const setSelectedTree = (payload) => ({
	type: SET_SELECTED_TREE_DETAILS,
	payload,
});

export const setSelectedTreeGroup = (payload) => ({
	type: SET_SELECTED_TREE_GROUP,
	payload,
});

export const resetSelectedTreeGroup = (payload) => ({
	type: RESET_SELECTED_TREE_GROUP,
	payload,
});

export const setNewTreeGroupData = (payload) => ({
	type: SET_NEW_TREE_GROUP,
	payload,
});

export const resetNewTreeGroupData = () => ({
	type: RESET_NEW_TREE_GROUP,
});
