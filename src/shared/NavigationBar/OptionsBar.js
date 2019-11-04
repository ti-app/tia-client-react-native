import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Icon } from 'native-base';
import * as colors from '../../styles/colors';

const OptionsBar = ({ title, leftOption, rightOption }) => (
	<View style={styles.container}>
		{leftOption ? (
			<TouchableOpacity style={styles.leftButton} onPress={() => leftOption.action()}>
				{leftOption.label ? (
					<Text style={styles.leftOptionLabel}> {leftOption.label} </Text>
				) : (
					<Icon type="FontAwesome5" name="arrow-left" style={styles.leftIcon} />
				)}
			</TouchableOpacity>
		) : (
			<View style={styles.leftButton} />
		)}
		<View style={styles.titleContainer}>
			<Text style={styles.title}> {title} </Text>
		</View>
		{rightOption ? (
			<TouchableOpacity style={styles.rightButton} onPress={() => rightOption.action()}>
				<Text style={styles.rightOptionLabel}> {rightOption.label} </Text>
			</TouchableOpacity>
		) : (
			<View style={styles.rightButton} />
		)}
	</View>
);

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
	},
	titleContainer: {
		marginTop: 10,
		flex: 2.2,
	},
	title: {
		alignSelf: 'center',
		fontSize: 18,
	},
	leftOptionLabel: {},
	rightOptionLabel: {
		textAlign: 'right',
	},
	leftButton: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingLeft: 10,
		flex: 0.4,
	},
	leftIcon: { color: colors.black.toString(), fontSize: 20 },
	rightButton: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingRight: 10,
		flex: 0.4,
	},
});

export default OptionsBar;
