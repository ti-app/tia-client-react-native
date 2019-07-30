import React from 'react';

import { Platform, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import axios from 'axios';
import InitialLoadingScreen from './screens/InitialLoadingScreen';

import AppNavigator from './navigation/AppNavigator';
import MainTabNavigator from './navigation/MainNavigator';
// import {
// 	FIREBASE_CONFIG_API_KEY,
// 	FIREBASE_CONFIG_AUTH_DOMAIN,
// 	FIREBASE_CONFIG_DATABASE_URL,
// 	FIREBASE_CONFIG_PROJECT_ID,
// 	FIREBASE_CONFIG_STORAGE_BUCKET,
// 	FIREBASE_CONFIG_MESSAGING_SENDER_ID,
// } from 'react-native-dotenv';
import NavigationUtil from './utils/Navigation';
import { setLoading } from './store/actions/ui-interactions.action';
import { updateUserStatus } from './store/actions/auth.action';

const FIREBASE_CONFIG_API_KEY = 'AIzaSyD20hbjW0i5Yh5aT_rJL6dLDQ1oyX59ljo';
const FIREBASE_CONFIG_AUTH_DOMAIN = 'ti-app-client-6e554.firebaseapp.com';
const FIREBASE_CONFIG_DATABASE_URL = 'https://ti-app-client-6e554.firebaseio.com';
const FIREBASE_CONFIG_PROJECT_ID = 'ti-app-client-6e554';
const FIREBASE_CONFIG_STORAGE_BUCKET = 'ti-app-client-6e554.appspot.com';
const FIREBASE_CONFIG_MESSAGING_SENDER_ID = '67755937701';

class AppContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticationStatus: 'checking', // values: checking, authenticated, unauthenticated
		};
	}

	componentWillMount() {
		// Initialize firebase...
		if (!firebase.apps.length) {
			const firebaseConfig = {
				apiKey: FIREBASE_CONFIG_API_KEY,
				authDomain: FIREBASE_CONFIG_AUTH_DOMAIN,
				databaseURL: FIREBASE_CONFIG_DATABASE_URL,
				projectId: FIREBASE_CONFIG_PROJECT_ID,
				storageBucket: FIREBASE_CONFIG_STORAGE_BUCKET,
				messagingSenderId: FIREBASE_CONFIG_MESSAGING_SENDER_ID,
			};
			firebase.initializeApp(firebaseConfig);
		}
		firebase.auth().onAuthStateChanged(async (user) => {
			const { updateUser } = this.props;
			this.setState({
				authenticationStatus: user ? 'authenticated' : 'unauthenticated',
			});
			updateUser(!!user, user);

			await AsyncStorage.setItem('USER', JSON.stringify(user));
			setLoading(false);

			if (user) {
				const { accessToken } = JSON.parse(JSON.stringify(user)).stsTokenManager;
				console.log(JSON.parse(JSON.stringify(user)));
				console.log('Access Token:', accessToken);
				axios.interceptors.request.use(
					(config) => {
						const { headers, noloading, ...rest } = config;
						if (!noloading) {
							setLoading(true);
						}

						return {
							headers: {
								'x-id-token': accessToken,
								...headers,
							},
							...rest,
						};
					},
					(error) => Promise.reject(error)
				);
				axios.interceptors.response.use(
					(response) => {
						setLoading(false);
						return response;
					},
					(error) => Promise.reject(error)
				);
			}
		});
	}

	componentDidMount() {
		// const { setLoading, user } = this.props;
		// if (!user || !user.stsTokenManager) {
		//   return;
		// }
		// const xIdToken = user.stsTokenManager.accessToken;
	}

	render() {
		const { loading } = this.props;
		const { authenticationStatus } = this.state;
		return (
			<View style={styles.container}>
				{loading ? (
					<View style={styles.loading}>
						<ActivityIndicator size="large" color="#0000ff" />
					</View>
				) : null}
				{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
				{(() => {
					switch (authenticationStatus) {
						case 'unauthenticated':
							return <AppNavigator />;
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
				})()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
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

const mapStateToProps = (state) => ({
	loading: state.ui.loading,
	user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
	setLoading: (flag) => dispatch(setLoading(flag)),
	updateUser: (isLoggedIn, user) => dispatch(updateUserStatus(isLoggedIn, user)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AppContent);
