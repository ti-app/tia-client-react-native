import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon, Button } from 'native-base';
// import * as firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';

import FormInput from '../../shared/FormInput/FormInput';
import { space } from '../../styles/variables';
import {
	showEmailSuccessfullToast,
	showPasswordResetIssueToast,
} from '../../utils/predefinedToasts';
import logger from '../../utils/logger';
import * as colors from '../../styles/colors';
import * as uiActions from '../../store/actions/ui-interactions.action';

const ResetPasswordForm = ({ navigation }) => {
	const [email, setEmail] = useState('');

	const dispatch = useDispatch();
	const setLoading = useCallback((flag) => dispatch(uiActions.setLoading(flag)), [dispatch]);

	const onResetClick = () => {
		// const auth = firebase.auth();

		setLoading(true);

		auth()
			.sendPasswordResetEmail(email)
			.then(() => {
				showEmailSuccessfullToast();
				setLoading(false);
				navigation.navigate('Home');
			})
			.catch((error) => {
				logger.logError(error, 'Error while sending reset password mail');
				showPasswordResetIssueToast();
				setLoading(false);
			});
	};

	return (
		<View style={styles.container}>
			<FormInput
				icon={<Icon type="FontAwesome5" style={{ color: colors.black.toString() }} name="user" />}
				placeholder="Email Address"
				textContentType="emailAddress"
				onChangeText={(_email) => setEmail(_email)}
			/>
			<Button full success onPress={onResetClick}>
				<Text>SEND PASSWORD RESET LINK</Text>
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingLeft: space.base,
		paddingRight: space.base,
	},
});

export default ResetPasswordForm;
