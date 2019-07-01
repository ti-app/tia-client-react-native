import { createStackNavigator, createAppContainer } from 'react-navigation';
// import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';
// import LoadingScreen from '../screens/InitialLoadingScreen';

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
