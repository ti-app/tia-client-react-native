import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';

import { Toast } from 'native-base';
import * as firebase from 'firebase';
import { space } from '../../styles/variables';
import ProductButton from '../shared/ProductButton';
import FormInput from '../shared/FormInput';
import ProductText from '../shared/ProductText';
import { setLoading } from '../../store/actions/ui-interactions.action';
import { showWelcomeLoginToast } from '../../utils/PreDefinedToasts';

import * as colors from '../../styles/colors';

class LoginForm extends React.Component {
	state = {
		email: '',
		password: '',
	};

	onEmailChange = (email) => {
		this.setState({ email });
	};

	onPasswordChange = (password) => {
		this.setState({ password });
	};

	onLoginClick = async () => {
		const { email, password } = this.state;
		const { setLoading, navigation } = this.props;
		setLoading(true);
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(async (firebaseUser) => {
				try {
					setLoading(false);
					showWelcomeLoginToast();
					navigation.navigate('Home');
					await AsyncStorage.setItem('USER', JSON.stringify(firebaseUser));
				} catch (error) {
					setLoading(false);
					Toast.show({
						text: error,
						buttonText: 'Okay',
						type: 'warning',
					});
					console.log('Error', error);
				}
			})
			.catch((error) => {
				setLoading(false);
				Toast.show({
					text: error,
					buttonText: 'Okay',
					type: 'warning',
				});
				console.log('Error', error);
			});
	};

	render() {
		const { style, navigation } = this.props;
		return (
			<View style={style}>
				<FormInput
					icon={<Entypo color={colors.black.toString()} name="user" />}
					placeholder="Email Address"
					textContentType="emailAddress"
					onChangeText={this.onEmailChange}
				/>
				<FormInput
					icon={<Entypo color={colors.black.toString()} name="lock" />}
					placeholder="Password"
					textContentType="password"
					onChangeText={this.onPasswordChange}
					secureTextEntry
				/>
				<TouchableOpacity
					style={styles.forgetPassword}
					onPress={() => navigation.navigate('ResetPassword')}
				>
					<ProductText>Forgot Password?</ProductText>
				</TouchableOpacity>
				<View>
					<ProductButton full success onPress={this.onLoginClick}>
						LOGIN
					</ProductButton>
				</View>
			</View>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	setLoading: (flag) => dispatch(setLoading(flag)),
});

export default connect(
	null,
	mapDispatchToProps
)(LoginForm);

const styles = StyleSheet.create({
	forgetPassword: {
		paddingTop: space.base,
		paddingBottom: space.base,
	},
});
