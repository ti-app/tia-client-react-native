import { FETCH_USER_LOCATION_SUCCESS } from '../actions/location.action';

const initialState = {
	userLocation: {
		latitude: 18.5740821,
		longitude: 73.7777393,
	},
};

const locationReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_USER_LOCATION_SUCCESS: {
			return { ...state, userLocation: action.payload.coords };
		}

		default: {
			return state;
		}
	}
};

export default locationReducer;

export const selectUserLocation = (state) => state.location.userLocation;
