import {
	FETCH_TREE_GROUP_SUCCESS,
	RESET_SELECTED_TREE_DETAILS,
	SET_SELECTED_TREE_DETAILS,
} from '../actions/tree.action';

const initialState = {
	treeGroups: [],
	// holds the details of the tree currently displayed on HomeScree / HomeMap
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

		case RESET_SELECTED_TREE_DETAILS: {
			return {
				...state,
				selectedTreeDetails: null,
			};
		}

		default: {
			return state;
		}
	}
};

export default treeReducer;
