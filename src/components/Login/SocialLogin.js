import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { GoogleSignin } from 'react-native-google-signin';

import ProductButton from '../shared/ProductButton';
import { setLoading } from '../../store/actions/ui-interactions.action';
import { updateUserStatus } from '../../store/actions/auth.action';

const FB_APP_ID = '2439803646062305';

GoogleSignin.configure({
	webClientId: '67755937701-f7sf64nd0jnbqke4vuf209b8els3uq13.apps.googleusercontent.com',
});

class SocialLogin extends React.Component {
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

	onSignIn = async (googleUser) => {
		// Build Firebase credential with the Google ID token.
		const credential = firebase.auth.GoogleAuthProvider.credential(
			googleUser.idToken,
			googleUser.accessToken
		);
		// Sign in with credential from the Google user.
		firebase
			.auth()
			.signInWithCredential(credential)
			.then(async (result) => {
				console.log('user registered!', result);
			})
			.catch((error) => {
				console.log('error while signing!', error);
			});
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
				.signInWithCredential(credential)
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

	signInWithGoogle = async () => {
		const { navigation } = this.props;
		try {
			await GoogleSignin.hasPlayServices();
			const result = await GoogleSignin.signIn();
			await this.onSignIn(result);
			navigation.navigate('Home');
			return result.accessToken;
		} catch (error) {
			console.log('Google Login failed', error);
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
							this.signInWithGoogle();
							console.log('Google Sign in implementation is pending.');
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
