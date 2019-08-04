import { TOGGLE_DRAWER, TOGGLE_FILTER, SET_LOADING } from '../actions/ui-interactions.action';

const initialState = {
	isDrawerOpen: false,
	isFilterOpen: false,
	isTreeDetailsOpen: false,
	loading: false,
};

const uiInteractionsReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_DRAWER: {
			return {
				isDrawerOpen: !state.isDrawerOpen,
			};
		}
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
