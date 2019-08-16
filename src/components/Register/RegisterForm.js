import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as firebase from 'firebase';

import FormInput from '../shared/FormInput';
import ProductButton from '../shared/ProductButton';
import { setLoading } from '../../store/actions/ui-interactions.action';
import {
	showSuccessfulRegisterToast,
	showSomethingBadToast,
	showErrorToast,
} from '../../utils/PreDefinedToasts';

import * as colors from '../../styles/colors';

class RegisterPasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPassword: false,
			email: '',
			password: '',
			location: '',
		};
	}

	onEmailChange = (email) => {
		this.setState({ email });
	};

	onPasswordChange = (password) => {
		this.setState({ password });
	};

	onLocationChange = (location) => {
		this.setState({ location });
	};

	onRegisterClick = () => {
		this.registerWithFirebase();
	};

	registerWithFirebase() {
		setLoading(true);

		const { setLoading, navigation } = this.props;
		const { email, password, location } = this.state;
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(
				() => {
					firebase
						.auth()
						.currentUser.updateProfile({
							location,
						})
						.then(async () => {
							try {
								setLoading(false);
								navigation.navigate('Home');
								this.setState({
									showPassword: false,
									email: '',
									password: '',
									location: '',
								});
								showSuccessfulRegisterToast();
							} catch (error) {
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
	}

	onTogglePasswordVisiblity = () => {
		this.setState((prevState) => {
			this.setState({ ...prevState, showPassword: !prevState.showPassword });
		});
	};

	render() {
		const { showPassword } = this.state;
		return (
			<View>
				<FormInput
					icon={<AntDesign color={colors.black.toString()} name="user" />}
					placeholder="Email Address"
					textContentType="emailAddress"
					onChangeText={this.onEmailChange}
				/>
				<FormInput
					icon={<Entypo color={colors.black.toString()} name="lock" />}
					secondaryIcon={
						showPassword ? (
							<AntDesign size={15} color={colors.black.toString()} name="eye" />
						) : (
							<AntDesign size={15} color={colors.black.toString()} name="eyeo" />
						)
					}
					placeholder="Passsword"
					textContentType="password"
					secureTextEntry={!showPassword}
					onChangeText={this.onPasswordChange}
					secondaryIconPress={this.onTogglePasswordVisiblity}
				/>
				<FormInput
					icon={<EvilIcons color={colors.black.toString()} name="location" />}
					placeholder="Location"
					textContentType="location"
					onChangeText={this.onLocationChange}
				/>
				<ProductButton full success onPress={this.onRegisterClick}>
					REGISTER
				</ProductButton>
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
)(RegisterPasswordForm);
