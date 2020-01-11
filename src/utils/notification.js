// Ref: https://medium.com/@anum.amin/react-native-integrating-push-notifications-using-fcm-349fff071591
import config from '../config/common';
import PushNotification from 'react-native-push-notification';

// initialize notification listeners
let notificationListenerRef = null;
let notificationOpenedListenerRef = null;
let messageListenerRef = null;

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

	/*
	 * Triggered when a particular notification has been received in foreground
	 * */
	// notificationListenerRef = rnFirebase.notifications().onNotification((notification) => {
	// 	const { data } = notification;
	// 	callback(config.notificationAppState.foreground, JSON.parse(data.payload));
	// });
	/*
	 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
	 * */
	// notificationOpenedListenerRef = rnFirebase.notifications().onNotificationOpened((notificationOpen) => {
	// 	console.log('TCL: createNotificationListeners -> notificationOpen', notificationOpen);
	// 	const { data } = notificationOpen.notification;
	// 	callback(config.notificationAppState.background, JSON.parse(data.payload));
	// });
	/*
	 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
	 * */
	// const notificationOpen = await rnFirebase.notifications().getInitialNotification();
	// if (notificationOpen) {
	// 	console.log('TCL: createNotificationListeners -> notificationOpen', notificationOpen);
	// 	const { data } = notificationOpen.notification;
	// 	callback(config.notificationAppState.killed, JSON.parse(data.payload));
	// }
	/*
	 * Triggered for data only payload in foreground
	 * */
	// Implement it based on usecase need.
	// messageListenerRef = rnFirebase.messaging().onMessage((message) => {
	// 	//process data message
	// 	console.log(JSON.stringify(message));
	// 	callback(message);
	// });
};

export const stopNotificationListeners = () => {
	console.log('TCL: stopNotificationListeners -> stopNotificationListeners');
	if (notificationListenerRef && notificationOpenedListenerRef && messageListenerRef) {
		notificationListenerRef();
		notificationOpenedListenerRef();
		messageListenerRef();
	}
};
