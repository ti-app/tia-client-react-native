import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import { LoginManager, AccessToken as FBAccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import Config from 'react-native-config';

import { showLoginFailed } from '../../utils/predefinedToasts';
import logger from '../../utils/logger';

const { GOOGLE_WEB_CLIENT_ID } = Config;

GoogleSignin.configure({
	webClientId: GOOGLE_WEB_CLIENT_ID,
});

const SocialLogin = ({ style }) => {
	const signInWithFB = async () => {
		const { isCancelled } = await LoginManager.logInWithPermissions(['public_profile']);

		if (!isCancelled) {
			const { accessToken } = await FBAccessToken.getCurrentAccessToken();

			const credential = auth.FacebookAuthProvider.credential(accessToken);

			await auth().signInWithCredential(credential);

			analytics().logLogin({
				method: 'facebook',
			});
		}
	};

	const signInWithGoogle = async () => {
		await GoogleSignin.hasPlayServices();
		const googleUser = await GoogleSignin.signIn();

		const credential = auth.GoogleAuthProvider.credential(
			googleUser.idToken,
			googleUser.accessToken
		);

		await auth().signInWithCredential(credential);
		analytics().logLogin({
			method: 'google',
		});
	};

	const handleFBSignIn = () => {
		try {
			signInWithFB();
		} catch (error) {
			logger.logError(error, 'Error login with facebook');
			showLoginFailed();
		}
	};

	const handleGoogleSignIn = () => {
		try {
			signInWithGoogle();
		} catch (error) {
			logger.logError(error, 'Error login with google');
			showLoginFailed();
		}
	};

	return (
		<View style={[styles.container, style]}>
			<View style={styles.button}>
				<Button full style={styles.facebookButton} onPress={handleFBSignIn}>
					<Text>FACEBOOK</Text>
				</Button>
			</View>
			<View style={styles.button}>
				<Button full style={styles.googleButton} onPress={handleGoogleSignIn}>
					<Text>GOOGLE</Text>
				</Button>
			</View>
		</View>
	);
};

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

export default SocialLogin;
