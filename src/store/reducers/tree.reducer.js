import {
	FETCH_TREE_GROUP_SUCCESS,
	SET_SELECTED_TREE_DETAILS,
	SET_SELECTED_TREE_GROUP,
	RESET_SELECTED_TREE_GROUP,
	SET_NEW_TREE_GROUP,
	RESET_NEW_TREE_GROUP,
} from '../actions/tree.action';

const initialState = {
	treeGroups: [],
	selectedTree: null,
	selectedTreeGroup: null,
	newTreeGroup: {
		distribution: 'single',
		trees: [],
		health: null,
		plantType: '',
		waterCycle: 0,
		photo: '',
	},
};

const treeReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TREE_GROUP_SUCCESS: {
			return { ...state, treeGroups: action.payload };
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

		case SET_NEW_TREE_GROUP: {
			return {
				...state,
				newTreeGroup: { ...state.newTreeGroup, ...action.payload },
			};
		}

		case RESET_NEW_TREE_GROUP: {
			return {
				...state,
				newTreeGroup: {
					distribution: 'single',
					trees: [],
					health: null,
					plantType: '',
					waterCycle: 0,
					photo: '',
				},
			};
		}

		default: {
			return state;
		}
	}
};

export default treeReducer;
