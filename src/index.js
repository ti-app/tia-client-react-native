import React from 'react';

import { Platform, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import axios from 'axios';
import * as firebase from 'firebase';

import InitialLoadingScreen from './screens/InitialLoadingScreen';
import AppNavigator from './navigation/AppNavigator';
import MainTabNavigator from './navigation/MainNavigator';
import NavigationUtil from './utils/Navigation';
import { setLoading } from './store/actions/ui-interactions.action';
import { updateUserStatus } from './store/actions/auth.action';
import { showWelcomeLoginToast } from './utils/PreDefinedToasts';
import { initializeFirebase } from './utils/Firebase';
import * as colors from './styles/colors';

class AppContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticationStatus: 'checking',
		};
	}

	componentWillMount() {
		initializeFirebase();

		this.setupFirebaseAuthChange();
	}

	setupFirebaseAuthChange() {
		firebase.auth().onAuthStateChanged(async (user) => {
			const { updateUser, setLoading } = this.props;

			this.setState({
				authenticationStatus: user ? 'authenticated' : 'unauthenticated',
			});

			updateUser(!!user, user);

			await AsyncStorage.setItem('USER', JSON.stringify(user));

			setLoading(false);

			if (user) {
				showWelcomeLoginToast();

				// prettier-ignore
				const { accessToken } = JSON.parse(JSON.stringify(user)).stsTokenManager;

				console.log('Access Token:', accessToken);

				this.initializeAxiosInterceptors(accessToken);
			}
		});
	}

	initializeAxiosInterceptors(accessToken) {
		const { setLoading } = this.props;
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

	render() {
		const { loading } = this.props;
		const { authenticationStatus } = this.state;
		return (
			<View style={styles.container}>
				{loading ? (
					<View style={styles.loading}>
						<ActivityIndicator size="large" color={colors.blue} />
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
