import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Icon, Button } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';
// import * as firebase from 'firebase';
import auth from '@react-native-firebase/auth';

import FormInput from '../../shared/FormInput/FormInput';
import * as uiActions from '../../store/actions/ui-interactions.action';
import {
	showWelcomeLoginToast,
	showSomethingBadToast,
	showLoginFailed,
} from '../../utils/predefinedToasts';
import { space } from '../../styles/variables';
import * as colors from '../../styles/colors';

const LoginForm = ({ style, navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();
	const setLoading = useCallback((flag) => dispatch(uiActions.setLoading(flag)), [dispatch]);

	const onEmailChange = (_email) => {
		setEmail(_email);
	};

	const onPasswordChange = (_password) => {
		setPassword(_password);
	};

	const onLoginClick = async () => {
		setLoading(true);
		// firebase
		// 	.auth()
		auth()
			.signInWithEmailAndPassword(email, password)
			.then(async (firebaseUser) => {
				try {
					setLoading(false);
					showWelcomeLoginToast();
					navigation.navigate('Home');
					await AsyncStorage.setItem('USER', JSON.stringify(firebaseUser));
				} catch (error) {
					setLoading(false);
					showSomethingBadToast();
					console.log('Error while saving user in async storage.', error);
				}
			})
			.catch((error) => {
				setLoading(false);
				showLoginFailed();
				console.log('Error while login.', error);
			});
	};

	return (
		<View style={style}>
			<FormInput
				icon={<Icon type="FontAwesome5" style={styles.inputIcon} name="user" />}
				placeholder="Email Address"
				textContentType="emailAddress"
				onChangeText={onEmailChange}
			/>
			<FormInput
				icon={<Icon type="FontAwesome5" style={styles.inputIcon} name="lock" />}
				placeholder="Password"
				textContentType="password"
				onChangeText={onPasswordChange}
				secureTextEntry
			/>
			<TouchableOpacity
				style={styles.forgetPassword}
				onPress={() => navigation.navigate('ResetPassword')}
			>
				<Text>Forgot Password?</Text>
			</TouchableOpacity>
			<View>
				<Button full success onPress={onLoginClick}>
					<Text>LOGIN</Text>
				</Button>
			</View>
		</View>
	);
};

export default LoginForm;

const styles = StyleSheet.create({
	forgetPassword: {
		paddingTop: space.base,
		paddingBottom: space.base,
	},
	inputIcon: { fontSize: 15, color: colors.black.toString() },
});
