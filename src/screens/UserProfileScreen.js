import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import OptionsBar from '../components/Navigation/OptionsBar';
import * as colors from '../styles/colors';

const getCurrentUser = async () => {
	try {
		const user = await AsyncStorage.getItem('USER');
		return JSON.parse(user) || 'INITIAL';
	} catch (error) {
		throw error;
	}
};

export default class UserProfileScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: '',
		};
	}

	async componentWillMount() {
		const currentUser = await getCurrentUser();
		this.setState({ currentUser });
	}

	static navigationOptions = ({ navigation }) => {
		const header = {
			headerTitle: (
				<OptionsBar
					title="User Profile"
					leftOption={{
						label: 'Back',
						action: () => navigation.navigate('Home'),
					}}
					rightOption={{
						label: '',
						action: () => {},
					}}
				/>
			),
			headerTransparent: true,
			headerStyle: {
				height: 80,
				backgroundColor: colors.white,
				opacity: 0.8,
			},
			headerLeft: null,
		};

		return header;
	};

	render() {
		const { currentUser } = this.state;

		return (
			<View style={styles.container}>
				<Image
					square
					style={styles.avatar}
					source={{
						uri: currentUser.photoURL,
					}}
				/>
				{/* <UserStarRating /> */}
				<Text style={styles.name}>{currentUser.displayName}</Text>
				<Text style={styles.description}>Uploaded:20 Plants, Owned:5 Plants</Text>
				<View style={styles.bio}>{/* <BioTextInput /> */}</View>
				<TouchableOpacity style={styles.buttonContainer2}>
					<Text style={styles.biopublic}>View your public profile</Text>
				</TouchableOpacity>
				<View>
					<Text>
						{currentUser.email} {currentUser.emailVerified ? 'Verified' : 'Not Verified'}
					</Text>
				</View>
				<View>
					<Text>
						{currentUser.phoneNumber ? 'Telephone:' : ''}
						{currentUser.phoneNumber}
					</Text>
				</View>
				<TouchableOpacity style={styles.buttonContainer}>
					<Text>History</Text>
				</TouchableOpacity>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		display: 'flex',
		marginTop: 60,
		alignItems: 'center',
		padding: 30,
	},
	avatar: {
		width: 130,
		height: 130,
		borderRadius: 65,
		borderWidth: 4,
		borderColor: 'white',
		marginBottom: 10,
		alignSelf: 'center',
		marginTop: 10,
	},
	name: {
		fontSize: 28,
		fontWeight: '600',
	},
	info: {
		fontSize: 16,
		color: colors.blue,
		marginTop: 10,
	},
	description: {
		fontSize: 16,
		color: colors.gray,
		marginTop: 10,
		textAlign: 'center',
	},
	buttonContainer: {
		marginTop: 10,
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: 250,
		borderRadius: 30,
		backgroundColor: colors.blue,
	},
	buttonContainer2: {
		marginTop: 10,
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
		width: 250,
		backgroundColor: colors.white,
	},
	bio: {
		fontSize: 10,
		fontWeight: 'bold',
		fontStyle: 'italic',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: colors.gray,
	},
	biopublic: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});
