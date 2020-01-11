import React, { useState, useEffect, useCallback } from 'react';
import { Platform, StatusBar, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

import InitialLoadingScreen from './screens/InitialLoadingScreen/InitialLoadingScreen';
import AuthNavigator from './navigation/AuthNavigator';
import MainTabNavigator from './navigation/MainNavigator';
import NavigationUtil from './utils/navigation';
import * as uiActions from './store/actions/ui-interactions.action';
import * as authActions from './store/actions/auth.action';
import { registerFCMToken } from './store/actions/notification.action';
import { showWelcomeLoginToast } from './utils/predefinedToasts';
import { parseJwt } from './utils/jwt';
import * as colors from './styles/colors';
import { initializeAxiosInterceptors } from './utils/apiClient';
import { selectLoading } from './store/reducers/ui-interactions.reducer';
import { getFirebaseToken, getFirebaseUser } from './utils/firebase';

const AppContent = () => {
	const [authStatus, setAuthStatus] = useState('checking');
	const loading = useSelector(selectLoading);

	const dispatch = useDispatch();
	const setLoading = useCallback((flag) => dispatch(uiActions.setLoading(flag)), [dispatch]);
	const updateUser = useCallback(
		(loggedIn, user) => dispatch(authActions.updateUserStatus(loggedIn, user)),
		[dispatch]
	);
	const updateUserRole = useCallback((role) => dispatch(authActions.updateUserRole(role)), [
		dispatch,
	]);

	const registerDeviceFCMToken = useCallback((fcmToken) => dispatch(registerFCMToken(fcmToken)), [
		dispatch,
	]);

	useEffect(() => {
		setupFirebaseAuthChange();
	}, [setupFirebaseAuthChange]);

	useEffect(() => {
		auth().onAuthStateChanged(async (user) => {
			// get and register FCM token only after successful login
			if (user) {
				checkNotificationPermissions();
			}
		});

		// return () => {
		// 	stopNotificationListeners();
		// };
	}, []);

	const checkNotificationPermissions = async () => {
		const enabled = await messaging().hasPermission();
		if (enabled) {
			await saveFCMTokenAndListen();
		} else {
			requestNotificationPermission();
		}
	};

	const saveFCMTokenAndListen = async () => {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		if (!fcmToken) {
			fcmToken = await messaging().getToken();
			await AsyncStorage.setItem('fcmToken', fcmToken);
		}

		const isTokenSavedOnServer = await AsyncStorage.getItem('fcmTokenSaved');
		if (isTokenSavedOnServer !== 'true') {
			registerDeviceFCMToken(fcmToken);
		}
	};

	const requestNotificationPermission = async () => {
		try {
			await messaging().requestPermission();
			// User has authorized
			console.log('Notification permission granted');
			saveFCMTokenAndListen();
		} catch (error) {
			// User has rejected permissions
			console.log('permission rejected');
		}
	};

	const setupFirebaseAuthChange = useCallback(() => {
		// firebase.auth().onAuthStateChanged(async (user) => {
		auth().onAuthStateChanged(async () => {
			const user = getFirebaseUser();
			setAuthStatus(user ? 'authenticated' : 'unauthenticated');

			updateUser(!!user, user);

			await AsyncStorage.setItem('USER', JSON.stringify(user));

			setLoading(false);

			if (user) {
				showWelcomeLoginToast();
				// prettier-ignore
				const accessToken = await getFirebaseToken();
				initializeAnalytics(user);
				initializeInterceptors(accessToken);
				const { role } = parseJwt(accessToken);
				updateUserRole(role);
			}
		});
	}, [initializeInterceptors, setLoading, updateUser, updateUserRole]);

	const initializeAnalytics = async (user) => {
		const setUserId = () => analytics().setUserId(user.uid);
		try {
			await Promise.all([setUserId()]);
		} catch (error) {
			console.log('Error registering user data in google analytics');
		}
	};

	const initializeInterceptors = useCallback(
		(accessToken) => {
			const requestInterceptor = ({ data }) => {
				if (data) {
					const { noloading } = data;
					if (!noloading) {
						setLoading(true);
					}
				}
			};
			const responseInterceptor = () => setLoading(false);
			initializeAxiosInterceptors(accessToken, requestInterceptor, responseInterceptor);
		},
		[setLoading]
	);

	const getNavigator = () => {
		switch (authStatus) {
			case 'unauthenticated':
				return <AuthNavigator />;
			case 'authenticated':
				return (
					<MainTabNavigator
						ref={(navigatorRef) => {
							NavigationUtil.setTopLevelNavigator(navigatorRef);
						}}
					/>
				);
			default:
				return <InitialLoadingScreen />;
		}
	};

	return (
		<View style={styles.container}>
			{loading ? (
				<View style={styles.loading}>
					<ActivityIndicator size="large" color={colors.blue} />
				</View>
			) : null}
			{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
			{getNavigator()}
		</View>
	);
};

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

export default AppContent;
