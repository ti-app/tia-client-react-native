import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content } from 'native-base';

import RegisterForm from './RegisterForm';
import LogoWithText from '../../shared/LogoWithText/LogoWithText';
import SocialLogin from '../../shared/SocialLogin/SocialLogin';
import { space } from '../../styles/variables';
import OnboardDivider from '../../shared/OnboardDivider/OnboardDivider';
import OnboardNavigation from '../../shared/OnboardNavigation/OnboardNavigation';
import { useKeyboardHideHook } from '../../utils/customHooks';

const Register = ({ ...props }) => {
	const [isKeyboardOpen] = useKeyboardHideHook();

	return (
		<Container style={styles.container}>
			<Content>
				<View style={[styles.iconContainer, isKeyboardOpen ? styles.hide : null]}>
					<LogoWithText />
				</View>
				<View style={styles.formContainer}>
					<View style={styles.registerForm}>
						<RegisterForm {...props} />
					</View>
					<OnboardDivider style={styles.divider} />
					<View style={styles.socialRegister}>
						<SocialLogin {...props} />
					</View>
					<OnboardNavigation {...props} style={styles.onboard} linkToLogin />
				</View>
			</Content>
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
	divider: {
		marginBottom: space.base,
	},
	formContainer: {
		height: 400,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingLeft: space.base,
		paddingRight: space.base,
	},
	registerForm: {
		marginBottom: space.base,
	},
	socialRegister: {
		marginBottom: space.base,
	},
	onboard: {
		alignSelf: 'center',
	},
});

export default Register;
