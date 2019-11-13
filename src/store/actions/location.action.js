import { RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

// import { fetchTreeGroups } from './tree.action';

// export const SET_MAP_CENTER = 'SET_MAP_CENTER';
export const FETCH_USER_LOCATION = 'FETCH_USER_LOCATION';
export const FETCH_USER_LOCATION_SUCCESS = 'FETCH_USER_LOCATION_SUCCESS';

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
							if (mapRef) {
								const mapLocation = {
									latitude,
									longitude,
									latitudeDelta: 0.011582007226706992,
									longitudeDelta: 0.010652057826519012,
								};

								mapRef.animateToRegion(mapLocation, 2000);
							}
						}
					},
					(error) => {
						console.err('Error while getting current position', error);
					},
					{
						enableHighAccuracy: true,
						timeout: 15000,
						maximumAge: 10000,
					}
				);
			});
		} catch (err) {
			console.err('Error while asking for permisssion', err);
		}
	};
};

export const fetchUserLocationSuccess = (locationData) => ({
	type: FETCH_USER_LOCATION_SUCCESS,
	payload: locationData,
});

// export const setMapCenterAndFetchTreeGroups = locationData => {
//   return dispatch => {
//     dispatch(setMapCenter(locationData));
//     dispatch(fetchTreeGroups(locationData));
//   };
// };

// export const setMapCenter = locationData => ({
//   type: SET_MAP_CENTER,
//   payload: locationData
// });
