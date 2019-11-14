import {
	TOGGLE_FILTER,
	SET_LOADING,
	SET_CURRENT_RANGE_FILTER,
	SET_CURRENT_STATUS_LIST,
} from '../actions/ui-interactions.action';

const initialState = {
	isFilterOpen: false,
	isTreeDetailsOpen: false,
	loading: false,
	currentStatusList: ['healthy', 'weak', 'almostDead'],
	currentRangeFilter: 0.5,
};

const uiInteractionsReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_FILTER: {
			return {
				...state,
				isFilterOpen: !state.isFilterOpen,
			};
		}

		case SET_LOADING: {
			return {
				...state,
				loading: action.flag,
			};
		}

		case SET_CURRENT_STATUS_LIST: {
			return {
				...state,
				currentStatusList: [...(action.payload || [])],
			};
		}

		case SET_CURRENT_RANGE_FILTER: {
			return {
				...state,
				currentRangeFilter: action.payload,
			};
		}

		default: {
			return state;
		}
	}
};

export default uiInteractionsReducer;

export const selectLoading = (state) => state.ui.loading;
export const selectIsFilterOpen = (state) => state.ui.isFilterOpen;
export const selectIsTreeDetailsOpen = (state) => state.ui.isTreeDetailsOpen;
export const selectCurrentStatusList = (state) => state.ui.currentStatusList;
export const selectCurrentRangeFilter = (state) => state.ui.currentRangeFilter;
