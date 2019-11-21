import AsyncStorage from '@react-native-community/async-storage';
import apiClient from '../../utils/apiClient';

import showErrorToast from '../../utils/errorToasts';

export const REGISTER_FCM_TOKEN_SUCCESS = 'REGISTER_FCM_TOKEN_SUCCESS';

export const registerFCMToken = (fcmToken) => async (dispatch) => {
	console.log('TCL: registerFCMToken -> registerFCMToken');
	try {
		const response = await apiClient({
			method: 'post',
			url: `/user/notification/register`,
			headers: { 'Content-Type': 'application/json' },
			data: {
				fcmToken,
			},
		});
		await AsyncStorage.setItem('fcmTokenSaved', 'true');
		console.log('TCL: registerFCMToken -> response', response);

		// dispatch(fetchTreeActivitiesSuccess(response.data));
	} catch (err) {
		showErrorToast('Failed to register notification token.', err, dispatch);
	}
};
