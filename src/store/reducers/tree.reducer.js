import { FETCH_TREE_GROUP_SUCCESS, SET_SELECTED_TREE_DETAILS } from '../actions/tree.action';

const initialState = {
	treeGroups: [],
	selectedTreeDetails: null,
};

const treeReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TREE_GROUP_SUCCESS: {
			return { treeGroups: action.payload };
		}

		case SET_SELECTED_TREE_DETAILS: {
			return {
				...state,
				selectedTreeDetails: { ...action.payload },
			};
		}

		default: {
			return state;
		}
	}
};

export default treeReducer;
