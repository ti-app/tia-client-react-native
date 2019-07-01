import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';

import ProductButton from '../shared/ProductButton';
import { setLoading } from '../../store/actions/ui-interactions.action';
import { updateUserStatus } from '../../store/actions/auth.action';

const FB_APP_ID = '2439803646062305';

class SocialLogin extends React.Component {
	componentDidMount() {
		GoogleSignin.configure({
			// Repleace with your webClientId generated from Firebase console
			webClientId: '67755937701-5371f081rqom8d5lhc6m9hmdqlspjpmv.apps.googleusercontent.com',
			// webClientId: '141502997719-sui87ofok969fm799kl43k3sr6s1hg6v.apps.googleusercontent.com'
		});
	}

	_signIn = async () => {
		try {
			await GoogleSignin.hasPlayServices({
				showPlayServicesUpdateDialog: true,
			});
			const userInfo = await GoogleSignin.signIn();
			console.log('User Info --> ', userInfo);
		} catch (error) {
			console.log('Message', error.message);
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log('User Cancelled the Login Flow');
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log('Signing In');
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log('Play Services Not Available or Outdated');
			} else {
				console.log('Some Other Error', error);
			}
		}
	};

	isUserEqual = (googleUser, firebaseUser) => {
		if (firebaseUser) {
			const { providerData } = firebaseUser;
			for (let i = 0; i < providerData.length; i += 1) {
				if (
					providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
					providerData[i].uid === googleUser.getBasicProfile().getId()
				) {
					// We don't need to reauth the Firebase connection.
					return true;
				}
			}
		}
		return false;
	};

	signInWithFBAsync = async () => {
		const options = {
			permission: ['public_profile'],
		};
		const { type, token } = await Facebook.logInWithReadPermissionsAsync(FB_APP_ID, options);

		if (type === 'success') {
			const credential = firebase.auth.FacebookAuthProvider.credential(token);
			firebase
				.auth()
				.signInAndRetrieveDataWithCredential(credential)
				.then((response) => {
					console.log('FB Login successfully ', response);
				})
				.catch((error) => {
					console.log('FB Login error', error);
				});
		} else {
			console.log('Facebook log in failed.');
		}
	};

	render() {
		const { style } = this.props;
		return (
			<View style={[styles.container, style]}>
				<View style={styles.button}>
					<ProductButton
						full
						style={styles.facebookButton}
						onPress={() => this.signInWithFBAsync()}
					>
						FACEBOOK
					</ProductButton>
				</View>
				<View style={styles.button}>
					<ProductButton
						full
						style={styles.googleButton}
						onPress={() => {
							console.log('Google Sign in implementation is pending with expo unimodule.');
							//   this.signInWithGoogleAsync();
							this._signIn();
						}}
					>
						GOOGLE
					</ProductButton>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
	},
	button: {
		flex: 1,
	},
	facebookButton: {
		backgroundColor: '#3C5A99',
	},
	googleButton: {
		backgroundColor: '#BD4A39',
	},
});

const mapDispatchToProps = (dispatch) => ({
	setLoading: (flag) => dispatch(setLoading(flag)),
	updateUser: (isLoggedIn, user) => dispatch(updateUserStatus(isLoggedIn, user)),
});

export default connect(
	null,
	mapDispatchToProps
)(SocialLogin);
