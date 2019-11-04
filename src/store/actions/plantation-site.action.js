import { Toast } from 'native-base';

import apiClient from '../../utils/apiClient';

import showErrorToast from '../../utils/errorToasts';
import NavigationUtil from '../../utils/navigation';

export const ADD_PLANTATION_SITE = 'ADD_PLANTATION_SITE';
export const FETCH_PLANTATION_SITES = 'FETCH_PLANTATION_SITES';
export const FETCH_PLANTATION_SITES_SUCCESS = 'FETCH_PLANTATION_SITES_SUCCESS';
export const SET_SELECTED_PLANTATION_SITE = 'SET_SELECTED_PLANTATION_SITE';

/**
 * Accepts parameter treeGroup which should be a FormData including an Image.
 * @param {FormData} plantationSite
 */
export const addPlantationSite = (plantationSite) => async (dispatch, getState) => {
	const state = getState();
	const {
		location: { userLocation },
	} = state;

	try {
		await apiClient({
			method: 'post',
			url: '/site',
			data: plantationSite,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
		});

		NavigationUtil.navigate('Home');
		dispatch(
			fetchPlanatationSites({
				...userLocation,
			})
		);
	} catch (err) {
		showErrorToast('Error adding a plantation site.', err, dispatch);
	}
};

export const fetchPlanatationSites = (location, radius = 500) => async (dispatch) => {
	try {
		const { latitude: lat, longitude: lng } = location;

		const response = await apiClient({
			url: '/site',
			params: {
				lat,
				lng,
				radius,
			},
			headers: {
				'Content-Type': 'application/json',
			},
			noloading: true,
		});
		dispatch(fetchPlantationSiteSuccess(response.data));
		Toast.show({
			text: 'Getting nearby plantation sites.',
			duration: 2000,
			textStyle: {
				textAlign: 'center',
			},
		});
	} catch (err) {
		showErrorToast('Error fetching nearby plantation sites.', err, dispatch);
	}
};

export const deletePlantationSite = (plantationSite) => async (dispatch, getState) => {
	const state = getState();
	const {
		location: { userLocation },
	} = state;

	try {
		const { id } = plantationSite;
		const url = `/site/${id}`;
		await apiClient({
			url,
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'DELETE',
			noloading: true,
		});
		Toast.show({
			text: 'Plantation site was successfully deleted.',
			duration: 1000,
			textStyle: {
				textAlign: 'center',
			},
		});

		NavigationUtil.navigate('Home');

		dispatch(
			fetchPlanatationSites({
				...userLocation,
			})
		);
	} catch (err) {
		showErrorToast('Error deleting the plantation site.', err, dispatch);
	}
};

export const updatePlantationSite = (siteId, updatedPlantationSite) => async (
	dispatch,
	getState
) => {
	const state = getState();
	const {
		location: { userLocation },
	} = state;

	try {
		await apiClient({
			method: 'put',
			url: `/site/${siteId}`,
			data: updatedPlantationSite,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
		});

		NavigationUtil.navigate('Home');
		dispatch(
			fetchPlanatationSites({
				...userLocation,
			})
		);
	} catch (err) {
		showErrorToast('Error updating site.', err, dispatch);
	}
};

export const takeModActionForSite = (siteId, approval) => async (dispatch, getState) => {
	const state = getState();

	const {
		location: { userLocation },
	} = state;

	try {
		const url = `/site/${siteId}/mod-action`;
		await apiClient({
			url,
			method: 'patch',
			headers: {
				'Content-Type': 'application/json',
			},
			data: approval,
		});
		Toast.show({
			text: 'Successfully taken action',
			duration: 1000,
			textStyle: {
				textAlign: 'center',
			},
		});

		NavigationUtil.navigate('Home');

		dispatch(
			fetchPlanatationSites({
				...userLocation,
			})
		);
	} catch (err) {
		showErrorToast('Error taking action', err, dispatch);
	}
};

export const fetchPlantationSiteSuccess = (payload) => ({
	type: FETCH_PLANTATION_SITES_SUCCESS,
	payload,
});

export const setSelectedPlantationSite = (payload) => ({
	type: SET_SELECTED_PLANTATION_SITE,
	payload,
});
