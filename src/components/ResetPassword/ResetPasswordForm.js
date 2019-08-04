import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Toast } from 'native-base';
import * as firebase from 'firebase';

import FormInput from '../shared/FormInput';
import { space } from '../../styles/variables';
import ProductButton from '../shared/ProductButton';

export default class ResetPasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
		};
	}

	onEmailChange = (email) => {
		this.setState({ email });
	};

	onResetClick() {
		const { email } = this.state;
		const auth = firebase.auth();

		auth
			.sendPasswordResetEmail(email)
			.then(() => {
				Toast.show({
					text: `Email has been sent! `,
					buttonText: 'Okay',
					type: 'success',
				});
			})
			.catch(() => {
				Toast.show({
					text: `Issue while reseting password`,
					buttonText: 'Okay',
					type: 'error',
				});
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<FormInput
					icon={<Entypo name="user" />}
					placeholder="Email Address"
					textContentType="emailAddress"
					onChangeText={this.onEmailChange}
				/>
				<ProductButton full success onPress={this.onResetClick}>
					<Text>SEND PASSWORD RESET LINK</Text>
				</ProductButton>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: space.base,
		paddingRight: space.base,
	},
});
