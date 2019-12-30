import { Toast } from 'native-base';

import apiClient from '../../utils/apiClient';

import showErrorToast from '../../utils/errorToasts';
import NavigationUtil from '../../utils/navigation';

export const CREATE_PANIC_SITE = 'CREATE_PANIC_SITE';
export const FETCH_PANIC = 'FETCH_PANIC';
export const FETCH_PANIC_SUCCESS = 'FETCH_PANIC_SUCCESS';

const dispatchFetchPanicAction = (dispatch, getState) => {
	const state = getState();
	const {
		ui: { currentRangeFilter },
		location: { homeMapCenter },
	} = state;

	dispatch(
		fetchPanic(
			{
				...homeMapCenter,
			},
			currentRangeFilter * 1000
		)
	);
};

/**
 * Accepts parameter treeGroup which should be a FormData including an Image.
 * @param {FormData} panicData
 */
export const createPanic = (panicData) => async (dispatch, getState) => {
	try {
		await apiClient({
			method: 'post',
			url: '/panic',
			data: panicData,
			headers: {
				Accept: 'application/json',
				'content-type': 'multipart/form-data',
			},
		});

		NavigationUtil.navigate('Home');
		dispatchFetchPanicAction(dispatch, getState);
	} catch (err) {
		showErrorToast('Error creating a panic', err, dispatch);
	}
};

/**
 * Accepts parameter treeGroup which should be a FormData including an Image.
 * @param {String} panicId
 */
export const resolvePanic = (panicId) => async (dispatch, getState) => {
	try {
		await apiClient({
			method: 'delete',
			url: `/panic/${panicId}`,
			headers: {
				Accept: 'application/json',
			},
		});

		NavigationUtil.navigate('Home');
		dispatchFetchPanicAction(dispatch, getState);
	} catch (err) {
		showErrorToast('Error resolving a panic', err, dispatch);
	}
};

export const fetchPanic = (location, radius = 500) => async (dispatch) => {
	try {
		const { latitude: lat, longitude: lng } = location;

		const response = await apiClient({
			url: '/panic',
			params: {
				lat,
				lng,
				radius,
			},
			headers: {
				'content-type': 'application/json',
			},
			data: { noloading: true },
		});

		dispatch(fetchPanicSuccess(response.data));

		Toast.show({
			text: 'Looking for panic nearby.',
			duration: 2000,
			textStyle: {
				textAlign: 'center',
			},
		});
	} catch (err) {
		showErrorToast('Error looking for panic nearby.', err, dispatch);
	}
};

export const fetchPanicSuccess = (payload) => ({
	type: FETCH_PANIC_SUCCESS,
	payload,
});
