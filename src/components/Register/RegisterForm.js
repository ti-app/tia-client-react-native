import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
// import { Entypo, EvilIcons, AntDesign } from '@expo/vector-icons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Toast } from 'native-base';
import * as firebase from 'firebase';

import FormInput from '../shared/FormInput';
import ProductButton from '../shared/ProductButton';
import { setLoading } from '../../store/actions/ui-interactions.action';

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
		const { setLoading, navigation } = this.props;
		const { email, password, location } = this.state;
		setLoading(true);
		console.log('calling createUserWithEmailAndPassword ....', this.state);
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
								Toast.show({
									text: `Welcome! Successfully registerd in TIA`,
									buttonText: 'Great',
									type: 'success',
								});
							} catch (error) {
								Toast.show({
									text: `Something bad happened!`,
									buttonText: 'Oops',
									type: 'error',
								});
								console.log('Error while registering', error);
							}
						});
				},
				(error) => {
					setLoading(false);
					Toast.show({
						text: `${error.message}`,
						buttonText: 'Oops',
						type: 'error',
					});
					console.log(error.message);
				}
			);
	};

	onTogglePasswordVisiblity = () => {
		this.setState((prevState) => {
			this.setState({ ...prevState, showPassword: !prevState.showPassword });
		});
	};

	render() {
		const { showPassword } = this.state;
		return (
			<View style={styles.container}>
				<FormInput
					icon={<AntDesign name="user" />}
					placeholder="Email Address"
					textContentType="emailAddress"
					onChangeText={this.onEmailChange}
				/>
				<FormInput
					icon={<Entypo name="lock" />}
					secondaryIcon={
						showPassword ? <AntDesign size={15} name="eye" /> : <AntDesign size={15} name="eyeo" />
					}
					placeholder="Passsword"
					textContentType="password"
					secureTextEntry={!showPassword}
					onChangeText={this.onPasswordChange}
					secondaryIconPress={this.onTogglePasswordVisiblity}
				/>
				<FormInput
					icon={<EvilIcons name="location" />}
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

const styles = StyleSheet.create({
	container: {},
});

const mapDispatchToProps = (dispatch) => ({
	setLoading: (flag) => dispatch(setLoading(flag)),
});

export default connect(
	null,
	mapDispatchToProps
)(RegisterPasswordForm);
