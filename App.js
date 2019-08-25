import React from 'react';
import { StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StyleProvider, Root } from 'native-base';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import store from './src/store';
import AppContent from './src';
import loadResourcesAsync from './src/utils/LoadResources';
import * as colors from './src/styles/colors';

import firebase from 'react-native-firebase';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showIntroduction: false,
		};
	}

	async componentWillMount() {
		const launchStatus = await this.getLaunchStatus();
		this.setState({ showIntroduction: launchStatus === 'INITIAL' });
	}

	componentWillUnmount() {
		this.notificationListener;
		this.notificationOpenedListener;
	}

	async componentDidMount() {
		loadResourcesAsync();
		this.checkPermission();
		this.createNotificationListeners(); //add this line
	}

	async checkPermission() {
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			this.getToken();
		} else {
			this.requestPermission();
		}
	}

	async requestPermission() {
		try {
			await firebase.messaging().requestPermission();
			// User has authorised
			this.getToken();
		} catch (error) {
			// User has rejected permissions
			console.log('permission rejected');
		}
	}

	async getToken() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await firebase.messaging().getToken();
			if (fcmToken) {
				// user has a device token
				console.log('fcmToken:', fcmToken);
				await AsyncStorage.setItem('fcmToken', fcmToken);
			}
		}
		console.log('fcmToken:', fcmToken);
	}

	async createNotificationListeners() {
		/*
		 * Triggered when a particular notification has been received in foreground
		 * */
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			const { title, body, notificationId } = notification;
			console.log('onNotification:');

			const localNotification = new firebase.notifications.Notification({
				sound: 'sampleaudio',
				show_in_foreground: true,
			})
				.setSound('sampleaudio.wav')
				.setNotificationId(notificationId)
				.setTitle(title)
				.setBody(body)
				.android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
				.android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
				.android.setColor(colors.green) // you can set a color here
				.android.setPriority(firebase.notifications.Android.Priority.High);

			firebase
				.notifications()
				.displayNotification(localNotification)
				.catch((err) => console.error(err));
		});

		const channel = new firebase.notifications.Android.Channel(
			'fcm_FirebaseNotifiction_default_channel',
			'Demo app name',
			firebase.notifications.Android.Importance.High
		)
			.setDescription('Demo app description')
			.setSound('sampleaudio.wav');
		firebase.notifications().android.createChannel(channel);

		/*
		 * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
		 * */
		this.notificationOpenedListener = firebase
			.notifications()
			.onNotificationOpened((notificationOpen) => {
				const { title, body } = notificationOpen.notification;
				console.log('onNotificationOpened:');
			});

		/*
		 * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
		 * */
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			const { title, body } = notificationOpen.notification;
			console.log('getInitialNotification:');
		}
		/*
		 * Triggered for data only payload in foreground
		 * */
		this.messageListener = firebase.messaging().onMessage((message) => {
			//process data message
			console.log('JSON.stringify:', JSON.stringify(message));
		});
	}

	onIntroductionDone = async () => {
		this.setState({ showIntroduction: false });
		try {
			await AsyncStorage.setItem('LAUNCH_STATUS', 'NOT_INITIAL');
		} catch (error) {
			console.log('Error setting launch status', error);
		}
	};

	getLaunchStatus = async () => {
		try {
			const value = await AsyncStorage.getItem('LAUNCH_STATUS');
			return value || 'INITIAL';
		} catch (error) {
			console.log('Error gettings launch status', error);
			throw error;
		}
	};

	render() {
		const { showIntroduction } = this.state;
		if (showIntroduction) {
			return <AppIntroSlider slides={slides} onDone={this.onIntroductionDone} />;
		}

		return (
			<Root>
				<Provider store={store}>
					<StyleProvider style={getTheme(material)}>
						<AppContent />
					</StyleProvider>
				</Provider>
			</Root>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},

	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.5,
		backgroundColor: 'black',
		zIndex: 99,
	},
});

/* eslint-disable */
const slides = [
	{
		key: 'intro_1',
		title: 'Title 1',
		text: 'Description.\nSay something cool',
		image: require('./assets/images/tia_intro_1.png'),
		imageStyle: styles.introImage,
		backgroundColor: colors.green,
	},
	{
		key: 'intro_2',
		title: 'Title 2',
		text: 'Other cool stuff',
		image: require('./assets/images/tia_intro_1.png'),
		imageStyle: styles.introImage,
		backgroundColor: colors.yellow,
	},
	{
		key: 'intro_3',
		title: 'Rocket guy',
		text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
		image: require('./assets/images/tia_intro_1.png'),
		imageStyle: styles.introImage,
		backgroundColor: colors.orange,
	},
];
/* eslint-enable */
