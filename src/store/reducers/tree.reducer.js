import {
	FETCH_TREE_GROUP_SUCCESS,
	SET_SELECTED_TREE_DETAILS,
	SET_SELECTED_TREE_GROUP,
	RESET_SELECTED_TREE_GROUP,
} from '../actions/tree.action';

const initialState = {
	treeGroups: [],
	selectedTree: null,
	selectedTreeGroup: null,
};

const treeReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TREE_GROUP_SUCCESS: {
			return { treeGroups: action.payload };
		}

		case SET_SELECTED_TREE_DETAILS: {
			return {
				...state,
				selectedTree: { ...action.payload },
			};
		}

		case SET_SELECTED_TREE_GROUP: {
			return {
				...state,
				selectedTreeGroup: { ...action.payload },
			};
		}

		case RESET_SELECTED_TREE_GROUP: {
			return {
				...state,
				selectedTreeGroup: null,
			};
		}

		default: {
			return state;
		}
	}
};

export default treeReducer;
