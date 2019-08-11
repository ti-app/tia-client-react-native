import {
	FETCH_PLANTATION_SITES_SUCCESS,
	SET_SELECTED_PLANTATION_SITE_DETAILS,
} from '../actions/plantation-site.action';

const initialState = {
	plantationSites: [],
	selectedPlantationSiteDetails: null,
};

const plantationSiteReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_PLANTATION_SITES_SUCCESS: {
			return { plantationSites: action.payload };
		}

		case SET_SELECTED_PLANTATION_SITE_DETAILS: {
			return {
				...state,
				selectedPlantationSiteDetails: { ...action.payload },
			};
		}

		default: {
			return state;
		}
	}
};

export default plantationSiteReducer;
