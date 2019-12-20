import AsyncStorage from '@react-native-community/async-storage';
import apiClient from '../../utils/apiClient';

import showErrorToast from '../../utils/errorToasts';

export const REGISTER_FCM_TOKEN_SUCCESS = 'REGISTER_FCM_TOKEN_SUCCESS';

export const registerFCMToken = (fcmToken) => async (dispatch) => {
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
	} catch (err) {
		showErrorToast('Failed to register notification token.', err, dispatch);
	}
};

export const deregisterFCMToken = () => async (dispatch) => {
	const fcmToken = await AsyncStorage.getItem('fcmToken');

	try {
		const response = await apiClient({
			method: 'patch',
			url: `/user/notification/deregister`,
			headers: { 'Content-Type': 'application/json' },
			data: {
				fcmToken,
			},
		});
		if (response.status === 200) {
			await AsyncStorage.removeItem('fcmTokenSaved');
			await AsyncStorage.removeItem('fcmToken');
		}
		console.log('TCL: deregisterFCMToken -> response', response);
	} catch (err) {
		showErrorToast('Failed to register notification token.', err, dispatch);
	}
};
