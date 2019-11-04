/* eslint-disable global-require */
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'native-base';

import { space, font } from '../../styles/variables';

const LogoWithText = ({ style }) => {
	return (
		<View style={[styles.iconContainer, style]}>
			<Image style={styles.icon} source={require('../../../assets/images/icon.png')} />
			<Text style={styles.appName}>Tree Irrigation App</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	icon: {
		alignSelf: 'center',
		height: 60,
		width: 60,
		margin: space.base,
		borderRadius: 12,
	},

	appName: {
		alignSelf: 'center',
		fontSize: font.large,
	},
});

export default LogoWithText;
