import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { GoogleSignin } from 'react-native-google-signin';
import Config from 'react-native-config';

import ProductButton from '../shared/ProductButton';
import { setLoading } from '../../store/actions/ui-interactions.action';
import { updateUserStatus } from '../../store/actions/auth.action';

const { FB_APP_ID, GOOGLE_WEB_CLIENT_ID } = Config;

GoogleSignin.configure({
	webClientId: GOOGLE_WEB_CLIENT_ID,
});

class SocialLogin extends React.Component {
	signInWithFB = async () => {
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
		try {
			await GoogleSignin.hasPlayServices();
			const googleUser = await GoogleSignin.signIn();

			const credential = firebase.auth.GoogleAuthProvider.credential(
				googleUser.idToken,
				googleUser.accessToken
			);

			firebase
				.auth()
				.signInWithCredential(credential)
				.then(async (result) => {
					console.log('user registered!', result);
				})
				.catch((error) => {
					console.log('Google Login failed', error);
				});
		} catch (error) {
			console.log('Google Login failed', error);
		}
	};

	render() {
		const { style } = this.props;
		return (
			<View style={[styles.container, style]}>
				<View style={styles.button}>
					<ProductButton full style={styles.facebookButton} onPress={() => this.signInWithFB()}>
						FACEBOOK
					</ProductButton>
				</View>
				<View style={styles.button}>
					<ProductButton
						full
						style={styles.googleButton}
						onPress={() => {
							this.signInWithGoogle();
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
