import React, { useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Container } from 'native-base';

import ResetPasswordForm from './ResetPasswordForm';
import LogoWithText from '../../shared/LogoWithText/LogoWithText';
import { useKeyboardHideHook } from '../../utils/customHooks';

const ResetPassword = ({ ...props }) => {
	const [isKeyboardOpen] = useKeyboardHideHook();

	return (
		<Container style={styles.container}>
			<KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
				<View style={[styles.iconContainer, isKeyboardOpen ? styles.hide : null]}>
					<LogoWithText />
				</View>
				<View style={styles.formContainer}>
					<View style={styles.form}>
						<ResetPasswordForm {...props} />
					</View>
				</View>
			</KeyboardAvoidingView>
		</Container>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		marginTop: 60,
		alignSelf: 'center',
	},
	hide: {
		display: 'none',
	},
	formContainer: {
		height: 400,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	form: {},
});

export default ResetPassword;
