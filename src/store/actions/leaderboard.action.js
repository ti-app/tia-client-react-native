import apiClient from '../../utils/apiClient';

import showErrorToast from '../../utils/predefinedToasts';

export const FETCH_LEADERBOARD_SUCCESS = 'FETCH_LEADERBOARD_SUCCESS';

export const fetchLeaderboard = (treeId, limit = 10) => async (dispatch) => {
	try {
		const response = await apiClient({
			url: `/top-users?limit=${limit}`,
			headers: { 'content-type': 'application/json' },
		});

		dispatch(fetchLeaderboardSuccess(response.data));
	} catch (err) {
		showErrorToast('Error fetching leaderboard');
	}
};

export const fetchLeaderboardSuccess = (payload) => ({
	type: FETCH_LEADERBOARD_SUCCESS,
	payload,
});
