import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';

const AppNavigator = createStackNavigator(
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

export default createAppContainer(AppNavigator);
