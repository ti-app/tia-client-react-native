import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import FormInput from '../shared/FormInput';
import { space } from '../../styles/variables';
import ProductButton from '../shared/ProductButton';
import {
	showEmailSuccessfullToast,
	showPasswordResetIssueToast,
} from '../../utils/PreDefinedToasts';
import * as colors from '../../styles/colors';
import { setLoading } from '../../store/actions/ui-interactions.action';

class ResetPasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
		};
	}

	onEmailChange = (email) => {
		this.setState({ email });
	};

	onResetClick = () => {
		const { email } = this.state;
		const auth = firebase.auth();

		const { setLoading, navigation } = this.props;
		setLoading(true);

		auth
			.sendPasswordResetEmail(email)
			.then(() => {
				showEmailSuccessfullToast();
				setLoading(false);
				navigation.navigate('Home');
			})
			.catch((error) => {
				console.log(error);
				showPasswordResetIssueToast();
				setLoading(false);
			});
	};

	render() {
		return (
			<View style={styles.container}>
				<FormInput
					icon={<Entypo color={colors.black.toString()} name="user" />}
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

const mapDispatchToProps = (dispatch) => ({
	setLoading: (flag) => dispatch(setLoading(flag)),
});

export default connect(
	null,
	mapDispatchToProps
)(ResetPasswordForm);
