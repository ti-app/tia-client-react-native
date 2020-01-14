import config from '../config/common';
import PushNotification from 'react-native-push-notification';

/**
 *
 * @param {*} callback(appState,notificationData)
 */
export const createNotificationListeners = async (callback) => {
	const notificationListener = (notification) => {
		const { payload, foreground } = notification;
		const appState = foreground
			? config.notificationAppState.foreground
			: config.notificationAppState.background;
		callback(appState, JSON.parse(payload));
	};

	PushNotification.configure({
		onNotification: notificationListener,
	});
};
