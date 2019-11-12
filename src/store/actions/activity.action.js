import apiClient from '../../utils/apiClient';

import showErrorToast from '../../utils/errorToasts';

export const FETCH_TREE_ACTIVITIES_SUCCESS = 'FETCH_TREE_ACTIVITIES_SUCCESS';
export const FETCH_USER_ACTIVITIES_SUCCESS = 'FETCH_USER_ACTIVITIES_SUCCESS';

export const fetchTreeActivities = (treeId) => async (dispatch) => {
	try {
		const response = await apiClient({
			url: `/tree/${treeId}/activity`,
			headers: { 'Content-Type': 'application/json' },
		});

		dispatch(fetchTreeActivitiesSuccess(response.data));
	} catch (err) {
		showErrorToast('Error fetching tree activities.', err, dispatch);
	}
};

export const fetchUserActivities = (userId) => async (dispatch) => {
	try {
		const response = await apiClient({
			url: `/user/${userId}/activity`,
			headers: { Accept: 'application/json' },
		});

		dispatch(fetchUserActivitiesSuccess(response.data));
	} catch (err) {
		showErrorToast('Error fetching tree activities.', err, dispatch);
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
