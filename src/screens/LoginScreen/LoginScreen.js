import React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Container } from 'native-base';

import LoginForm from './LoginForm';
import OnboardNavigation from '../../shared/OnboardNavigation/OnboardNavigation';
import LogoWithText from '../../shared/LogoWithText/LogoWithText';
import SocialLogin from '../../shared/SocialLogin/SocialLogin';
import OnboardDivider from '../../shared/OnboardDivider/OnboardDivider';

import { white } from '../../styles/colors';
import { space } from '../../styles/variables';
import { useKeyboardHideHook } from '../../utils/customHooks';

const LoginScreen = ({ ...props }) => {
	const [isKeyboardOpen] = useKeyboardHideHook();

	return (
		<Container style={styles.container}>
			<Content contentContainerStyle={styles.content}>
				<LogoWithText style={[styles.icon, isKeyboardOpen ? styles.hide : null]} />
				<LoginForm {...props} style={styles.form} />
				<OnboardDivider style={styles.divider} />
				<SocialLogin {...props} style={styles.social} />
				<OnboardNavigation {...props} style={styles.onboard} linkToRegister />
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: white,
		paddingLeft: space.base,
		paddingRight: space.base,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
	},
	icon: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: space.xl,
	},
	hide: {
		display: 'none',
	},
	form: {
		paddingBottom: space.base,
	},
	divider: {
		paddingBottom: space.base,
	},
	social: {
		paddingBottom: space.base,
	},
	onboard: {
		alignSelf: 'center',
		width: '100%',
	},
});

LoginScreen.navigationOptions = {
	header: null,
};

export default LoginScreen;
