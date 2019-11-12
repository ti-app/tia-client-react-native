import {
	FETCH_TREE_ACTIVITIES_SUCCESS,
	FETCH_USER_ACTIVITIES_SUCCESS,
} from '../actions/activity.action';

const initialState = {
	tree: [],
	user: [],
};

const treeReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TREE_ACTIVITIES_SUCCESS: {
			return { ...state, tree: action.payload ? action.payload.activities : [] };
		}

		case FETCH_USER_ACTIVITIES_SUCCESS: {
			return {
				...state,
				user: action.payload,
			};
		}

		default: {
			return state;
		}
	}
};

export default treeReducer;

export const selectTreeActivities = (state) => state.activity.tree;
export const selectUserActivities = (state) => state.activity.user;
