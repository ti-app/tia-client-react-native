import { FETCH_LEADERBOARD_SUCCESS } from '../actions/leaderboard.action';

const initialState = [];

const leaderBoardReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_LEADERBOARD_SUCCESS: {
			return action.payload || [];
		}

		default: {
			return state;
		}
	}
};

export default leaderBoardReducer;

export const selectLeaderboard = (state) =>
	state.leaderboard.map((aUser) => {
		const { _id, count, displayName, photoUrl } = aUser;
		return { _id, count, displayName, photoUrl };
	});

export const selectLeaderboardUserById = (id) => (state) => {
	return state.leaderboard.find((aUser) => {
		const { _id } = aUser;
		if (_id === id) {
			return true;
		} else {
			return false;
		}
	});
};
