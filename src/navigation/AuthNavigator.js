import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen/ResetPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';

const AuthNavigator = createStackNavigator(
	{
		Login: {
			screen: LoginScreen,
		},
		ResetPassword: {
			screen: ResetPasswordScreen,
		},
		Register: {
			screen: RegisterScreen,
		},
	},
	{ initialRouteName: 'Login' }
);

export default createAppContainer(AuthNavigator);
