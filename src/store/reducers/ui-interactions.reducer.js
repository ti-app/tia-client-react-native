import { TOGGLE_FILTER, SET_LOADING } from '../actions/ui-interactions.action';

const initialState = {
	isFilterOpen: false,
	isTreeDetailsOpen: false,
	loading: false,
};

const uiInteractionsReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_FILTER: {
			return {
				isFilterOpen: !state.isFilterOpen,
			};
		}
		case SET_LOADING: {
			return {
				loading: action.flag,
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
