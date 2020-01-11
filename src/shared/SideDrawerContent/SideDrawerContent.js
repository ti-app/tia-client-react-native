import React, { useCallback } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Toast, Text, List, ListItem, View, Icon } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
// import firebase from 'firebase';
import auth from '@react-native-firebase/auth';

import * as colors from '../../styles/colors';
import { selectUser } from '../../store/reducers/auth.reducer';
import { deregisterFCMToken } from '../../store/actions/notification.action';

const SideDrawerContent = ({ navigation }) => {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const deregisterDeviceFCMToken = useCallback(() => dispatch(deregisterFCMToken()), [dispatch]);
	const logout = async () => {
		try {
			await auth().signOut();
			deregisterDeviceFCMToken();
			navigation.navigate('login');
			Toast.show({
				text: 'Log out successfully',
				buttonText: 'Okay',
			});
		} catch (e) {
			Toast.show({
				text: 'Issue while sign out',
				buttonText: 'Okay',
			});
		}
	};

	const navigateTo = (to) => {
		navigation.navigate(to);
	};

	return (
		<View style={styles.container}>
			{user && (
				<View>
					<View style={styles.userContainer}>
						{user.photoURL ? (
							<Image
								square
								style={styles.userPhoto}
								source={{
									uri: user.photoURL,
								}}
								onPress={() => navigateTo('UserProfile')}
							/>
						) : (
							<Icon
								type="FontAwesome5"
								style={[styles.userIcon, { fontSize: 60, color: colors.black.toString() }]}
								name="user-circle"
							/>
						)}
					</View>
					<Text style={styles.displayName} onPress={() => navigateTo('UserProfile')}>
						{user.displayName}
					</Text>
					<List>
						<ListItem button onPress={() => navigateTo('AddNewSpot')}>
							<Text style={styles.text}>Add a Plant</Text>
						</ListItem>
						<ListItem button>
							<Text style={styles.text}>Settings</Text>
						</ListItem>
						<ListItem button onPress={() => navigateTo('UserActivity')}>
							<Text style={styles.text}>My Activity</Text>
						</ListItem>
						<ListItem button onPress={() => navigateTo('Faq')}>
							<Text style={styles.text}>FAQ</Text>
						</ListItem>
						<ListItem button onPress={logout}>
							<Text style={styles.text}>Log out</Text>
						</ListItem>
					</List>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		height: '100%',
		width: '100%',
		backgroundColor: colors.green,
	},
	userContainer: {
		height: 80,
		width: 80,
		borderWidth: 1,
		borderRadius: 40,
		alignSelf: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	userPhoto: {
		height: 80,
		width: 80,
		borderRadius: 40,
		alignSelf: 'center',
	},
	displayName: {
		alignSelf: 'center',
		color: 'white',
		fontSize: 20,
		top: 5,
	},
	userIcon: {
		alignSelf: 'center',
	},
	text: {
		color: 'white',
		fontSize: 20,
	},
});

export default SideDrawerContent;
