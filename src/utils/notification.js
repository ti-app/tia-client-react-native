// Ref: https://medium.com/@anum.amin/react-native-integrating-push-notifications-using-fcm-349fff071591
import rnFirebase from 'react-native-firebase';
import config from '../config/common';

// initialize notification listeners
let notificationListenerRef = null;
let notificationOpenedListenerRef = null;
let messageListenerRef = null;

/**
 *
 * @param {*} callback(appState,notificationData)
 */
export const createNotificationListeners = async (callback) => {
	/*
	 * Triggered when a particular notification has been received in foreground
	 * */
	notificationListenerRef = rnFirebase.notifications().onNotification((notification) => {
		console.log('TCL: createNotificationListeners -> notificationListenerRef', notification);
		const { data } = notification;
		callback(config.notificationAppState.foreground, data);
	});

	/*
	 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
	 * */
	notificationOpenedListenerRef = rnFirebase
		.notifications()
		.onNotificationOpened((notificationOpen) => {
			console.log('TCL: createNotificationListeners -> notificationOpen', notificationOpen);
			const { data } = notificationOpen.notification;
			callback(config.notificationAppState.background, data);
		});

	/*
	 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
	 * */
	const notificationOpen = await rnFirebase.notifications().getInitialNotification();
	if (notificationOpen) {
		console.log('TCL: createNotificationListeners -> notificationOpen', notificationOpen);
		const { data } = notificationOpen.notification;
		callback(config.notificationAppState.killed, data);
	}

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
