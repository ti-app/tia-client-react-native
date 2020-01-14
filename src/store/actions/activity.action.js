import apiClient from '../../utils/apiClient';

import { showErrorToast } from '../../utils/predefinedToasts';
import logger from '../../utils/logger';

export const FETCH_TREE_ACTIVITIES_SUCCESS = 'FETCH_TREE_ACTIVITIES_SUCCESS';
export const FETCH_USER_ACTIVITIES_SUCCESS = 'FETCH_USER_ACTIVITIES_SUCCESS';

export const fetchTreeActivities = (treeId) => async (dispatch) => {
	try {
		const response = await apiClient({
			url: `/tree/${treeId}/activity`,
			headers: { 'content-type': 'application/json' },
		});

		dispatch(fetchTreeActivitiesSuccess(response.data));
	} catch (error) {
		showErrorToast('Error fetching tree activities');
		logger.logError(error, 'Error fetching tree activities');
	}
};

export const fetchUserActivities = (userId) => async (dispatch) => {
	try {
		const response = await apiClient({
			url: `/user/${userId}/activity`,
			headers: { Accept: 'application/json' },
		});

		dispatch(fetchUserActivitiesSuccess(response.data));
	} catch (error) {
		showErrorToast('Error fetching user activities');
		logger.logError(error, 'Error fetching user activities');
	}
};

export const fetchTreeActivitiesSuccess = (payload) => ({
	type: FETCH_TREE_ACTIVITIES_SUCCESS,
	payload,
});

export const fetchUserActivitiesSuccess = (payload) => ({
	type: FETCH_USER_ACTIVITIES_SUCCESS,
	payload,
});
