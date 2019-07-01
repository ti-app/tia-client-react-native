import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ProductText from './ProductText';

import { space, font } from '../../styles/variables';

export default ({ style }) => {
	return (
		<View style={[styles.iconContainer, style]}>
			<Image style={styles.icon} source={require('../../../assets/images/icon.png')} />
			<ProductText style={styles.appName}>Tree Irrigation App</ProductText>
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
