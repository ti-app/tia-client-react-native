import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default ({ leftOption }) => (
	<View style={styles.container}>
		<TouchableOpacity style={styles.leftButton} onPress={() => leftOption.action()}>
			<AntDesign name="arrowleft" size={20} />
		</TouchableOpacity>
		<View style={styles.titleContainer}>
			<Text style={styles.title}> Tree Details </Text>
		</View>
		<View style={styles.placeholder} />
	</View>
);

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	titleContainer: {
		marginTop: 10,
		flex: 1,
	},
	title: {
		alignSelf: 'center',
		fontSize: 18,
	},
	leftButton: {
		paddingLeft: 10,
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	leftIcon: { color: '#fff' },
	placeholder: {
		flex: 1,
	},
});
