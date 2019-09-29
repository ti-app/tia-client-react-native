import {
	FETCH_PLANTATION_SITES_SUCCESS,
	SET_SELECTED_PLANTATION_SITE,
} from '../actions/plantation-site.action';

const initialState = {
	plantationSites: [],
	selectedPlantationSite: null,
};

const plantationSiteReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_PLANTATION_SITES_SUCCESS: {
			return { plantationSites: action.payload };
		}

		case SET_SELECTED_PLANTATION_SITE: {
			return {
				...state,
				selectedPlantationSite: { ...action.payload },
			};
		}

		default: {
			return state;
		}
	}
};

export default plantationSiteReducer;
