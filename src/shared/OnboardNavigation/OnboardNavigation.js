import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button, View } from 'native-base';

const register = ({ navigation }) => (
	// FIXME: Change 'ResetPassword' to 'Register' after Register screen implemented.
	<View>
		<Text style={styles.text}>Not a member yet?</Text>
		<Button
			success
			transparent
			full
			onPress={() => {
				navigation.navigate('Register');
			}}
		>
			<Text>Register</Text>
		</Button>
	</View>
);

const login = ({ navigation }) => (
	<View>
		<Text style={styles.text}>Already a member?</Text>
		<Button full success transparent onPress={() => navigation.navigate('Login')}>
			<Text>Login</Text>
		</Button>
	</View>
);

const OnboardNavigation = ({ style, linkToRegister, linkToLogin, ...props }) => {
	return (
		<View style={style}>
			{linkToRegister && !linkToLogin ? register(props) : null}
			{!linkToRegister && linkToLogin ? login(props) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	text: {
		alignSelf: 'center',
	},
});

export default OnboardNavigation;
