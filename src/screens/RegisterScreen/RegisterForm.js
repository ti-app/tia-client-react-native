import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import { Icon, Button, Text } from 'native-base';
// import * as firebase from 'firebase';
import auth from '@react-native-firebase/auth';

import FormInput from '../../shared/FormInput/FormInput';
import * as uiActions from '../../store/actions/ui-interactions.action';
import {
	showSuccessfulRegisterToast,
	showSomethingBadToast,
	showErrorToast,
} from '../../utils/predefinedToasts';
import globalStyles from '../../styles/global';

const RegisterPasswordForm = ({ navigation }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [location, setLocation] = useState('');

	const dispatch = useDispatch();
	const setLoading = useCallback((flag) => dispatch(uiActions.setLoading(flag)), [dispatch]);

	const onRegisterClick = () => {
		registerWithFirebase();
	};

	const registerWithFirebase = () => {
		setLoading(true);

		// firebase
		auth()
			.createUserWithEmailAndPassword(email, password)
			.then(
				() => {
					// firebase
					auth()
						.currentUser.updateProfile({
							location,
						})
						.then(async () => {
							try {
								setLoading(false);
								navigation.navigate('Home');
								setShowPassword(false);
								setEmail('');
								setPassword('');
								setLocation('');
								showSuccessfulRegisterToast();
							} catch (error) {
								setLoading(false);
								showSomethingBadToast();
								console.log('Error while registering', error);
							}
						});
				},
				(error) => {
					setLoading(false);
					showErrorToast(error.message);
					console.log(error.message);
				}
			);
	};

	return (
		<View>
			<FormInput
				icon={<Icon type="FontAwesome5" style={globalStyles.inputIcon} name="user" />}
				placeholder="Email Address"
				textContentType="emailAddress"
				onChangeText={(_email) => setEmail(_email)}
			/>
			<FormInput
				icon={<Icon type="FontAwesome5" style={globalStyles.inputIcon} name="lock" />}
				secondaryIcon={
					showPassword ? (
						<Icon type="FontAwesome5" style={globalStyles.inputIcon} name="eye" />
					) : (
						<Icon type="FontAwesome5" style={globalStyles.inputIcon} name="eye-slash" />
					)
				}
				placeholder="Passsword"
				textContentType="password"
				secureTextEntry={!showPassword}
				onChangeText={(_password) => setPassword(_password)}
				secondaryIconPress={() => {
					setShowPassword((_showPassword) => !_showPassword);
				}}
			/>
			<FormInput
				icon={<Icon type="Entypo" style={globalStyles.inputIcon} name="location" />}
				placeholder="Location"
				textContentType="location"
				onChangeText={(_location) => setLocation(_location)}
			/>
			<Button full success onPress={onRegisterClick}>
				<Text>REGISTER</Text>
			</Button>
		</View>
	);
};

export default RegisterPasswordForm;
