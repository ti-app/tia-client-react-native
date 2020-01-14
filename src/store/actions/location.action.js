import { RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import Config from 'react-native-config';
import Axios from 'axios';

import { showErrorToast } from '../../utils/predefinedToasts';
import { goToMapLocation } from '../../utils/geo';
import logger from '../../utils/logger';

const { GOOGLE_PLACES_API_KEY, GOOGLE_GEOCODING_API_KEY } = Config;

export const SET_HOME_MAP_CENTER = 'SET_HOME_MAP_CENTER';
export const FETCH_USER_LOCATION_SUCCESS = 'FETCH_USER_LOCATION_SUCCESS';
export const FETCH_SEARCHED_LOCATION_SUCCESS = 'FETCH_SEARCHED_LOCATION_SUCCESS';

/**
 * Fetched user location and if mapRef is passed, moves map to userLocation
 * @param {Object} mapRef
 */
export const fetchUserLocation = (mapRef) => {
	return async (dispatch) => {
		try {
			const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

			if (result !== RESULTS.GRANTED) {
				// TODO: think of something what to do in here.
			}

			// I don't really understand why we need to use setTimeout()
			// Help yourself with the link below. And do tell me if you understand why we need to use this.
			// https://github.com/expo/expo/issues/946#issuecomment-453181014
			setTimeout(() => {
				// TODO: Not sure if following works with async/await. Try and find a way, just for the heck of consistency.
				Geolocation.getCurrentPosition(
					(position) => {
						dispatch(fetchUserLocationSuccess(position));

						if (position && position.coords) {
							const { latitude, longitude } = position.coords;
							const location = { latitude, longitude };
							goToMapLocation(mapRef, location);
							dispatch(setHomeMapCenter(location));
						}
					},
					(error) => {
						logger.logError(error, 'Error while getting current position');
					},
					{
						enableHighAccuracy: true,
						timeout: 15000,
						maximumAge: 10000,
					}
				);
			});
		} catch (error) {
			logger.logError(error, 'Error while asking for permisssion');
		}
	};
};

export const fetchUserLocationSuccess = (locationData) => ({
	type: FETCH_USER_LOCATION_SUCCESS,
	payload: locationData,
});

export const callGoogleAutoComplete = (location, searchQuery) => {
	const placesApiKey = GOOGLE_PLACES_API_KEY;

	return Axios({
		url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?location=${location}&input=${searchQuery}&key=${placesApiKey}`,
		data: { noloading: true },
	});
};

export const fetchSearchedLocation = (searchQuery) => async (dispatch, getState) => {
	const { userLocation } = getState().location;

	const { latitude, longitude } = userLocation || {};

	const location = `${latitude},${longitude}`;

	try {
		const response = await callGoogleAutoComplete(location, searchQuery);
		dispatch(fetchSearchedLocationSuccess(response.data));
	} catch (error) {
		showErrorToast('Error searching.');
		logger.logError(error, 'Error searching');
	}
};

export const callGooglePlacesApi = async (placeId) => {
	const geocodeApiKey = GOOGLE_GEOCODING_API_KEY;

	return Axios({
		url: `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${geocodeApiKey}`,
	});
};

export const callGoogleNearbyApi = async (location, radius = 100) => {
	const placesApiKey = GOOGLE_PLACES_API_KEY;
	const { latitude, longitude } = location;

	return Axios({
		url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&key=${placesApiKey}&radius=${radius}&rankby=prominence`,
	});
};

export const setHomeMapCenterByGooglePlaceId = (placeId, mapRef, callback) => async (dispatch) => {
	try {
		const response = await callGooglePlacesApi(placeId);

		const { results } = response.data;

		if (results && results.length && results[0] && results[0].geometry) {
			const { lat: latitude, lng: longitude } = results[0].geometry.location;
			const location = { latitude, longitude };
			goToMapLocation(mapRef, location);
			dispatch(setHomeMapCenter(location));
			callback();
		}
	} catch (error) {
		showErrorToast('Error getting the location.');
		logger.logError(error, 'Error calling google places api');
	}
};

export const fetchSearchedLocationSuccess = (data) => ({
	type: FETCH_SEARCHED_LOCATION_SUCCESS,
	payload: data,
});

export const setHomeMapCenter = (data) => ({
	type: SET_HOME_MAP_CENTER,
	payload: data,
});
