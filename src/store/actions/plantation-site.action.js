// import { Toast } from 'native-base';

import apiClient from '../../utils/ApiClient';

import showErrorToast from '../../utils/ErrorToast';
import NavigationUtil from '../../utils/Navigation';

export const ADD_PLANTATION_SITE = 'ADD_PLANTATION_SITE';
export const FETCH_PLANTATION_SITES = 'FETCH_PLANTATION_SITES';
export const FETCH_PLANTATION_SITES_SUCCESS = 'FETCH_PLANTATION_SITES_SUCCESS';
export const SET_SELECTED_PLANTATION_SITE_DETAILS = 'SET_SELECTED_PLANTATION_SITE_DETAILS';

/**
 * Accepts parameter treeGroup which should be a FormData including an Image.
 * @param {FormData} plantationSite
 */
export const addPlantationSite = (plantationSite) => async (dispatch /* ,getState */) => {
	// const state = getState();
	// const {
	// 	location: { userLocation },
	// } = state;

	try {
		await apiClient({
			method: 'post',
			url: '/site',
			data: plantationSite,
			headers: {
				Accept: 'application/json',
				// 'Content-Type': 'multipart/form-data',
				'Content-Type': 'application/json',
			},
		});

		NavigationUtil.navigate('Home');
		dispatch(fetchPlanatationSites(/* {
				...userLocation,
			} */));
	} catch (err) {
		showErrorToast('Error adding a plantation site.', err, dispatch);
	}
};

export const fetchPlanatationSites = () =>
	// location,
	// radius = 500,
	// health = 'healthy,weak,almostDead'
	async (dispatch) => {
		try {
			// const { latitude: lat, longitude: lng } = location;

			const response = await apiClient({
				url: '/site',
				// params: {
				// 	lat,
				// 	lng,
				// 	radius,
				// 	health,
				// },
				headers: {
					'Content-Type': 'application/json',
				},
				noloading: true,
			});
			dispatch(fetchPlantationSiteSuccess(response.data));
			// Toast.show({
			// 	text: 'Getting nearby plantation sites.',
			// 	duration: 2000,
			// 	textStyle: {
			// 		textAlign: 'center',
			// 	},
			// });
		} catch (err) {
			showErrorToast('Error fetching nearby plantation sites.', err, dispatch);
		}
	};

// export const deletePlantationSite = (plantationSite) => async (dispatch /* ,getState */) => {
// 	// const state = getState();
// 	// const {
// 	// 	location: { userLocation },
// 	// } = state;

// 	try {
// 		const { _id } = plantationSite;
// 		const url = `/site/${_id}`;
// 		await apiClient({
// 			url,
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			method: 'DELETE',
// 			noloading: true,
// 		});
// 		Toast.show({
// 			text: 'Plantation site was successfully deleted.',
// 			duration: 1000,
// 			textStyle: {
// 				textAlign: 'center',
// 			},
// 		});

// 		NavigationUtil.navigate('Home');

// 		dispatch(fetchPlanatationSites(/* {
// 				...userLocation,
// 			} */));
// 	} catch (err) {
// 		showErrorToast('Error deleting the plantation site.', err, dispatch);
// 	}
// };

export const fetchPlantationSiteSuccess = (payload) => ({
	type: FETCH_PLANTATION_SITES_SUCCESS,
	payload,
});

export const setSelectedPlantationSiteDetails = (payload) => ({
	type: SET_SELECTED_PLANTATION_SITE_DETAILS,
	payload,
});
