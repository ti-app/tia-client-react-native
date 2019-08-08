import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as colors from '../styles/colors';

export default () => (
	<View style={{ flex: 1 }}>
		<LinearGradient
			colors={[colors.orange, colors.green]}
			style={{
				position: 'relative',
				left: 0,
				right: 5,
				top: 0,
				height: 1000,
			}}
		>
			{/* Icon to be added here */}
			<Text style={styles.contentText}>CREATING A BETTER TOMORROW</Text>
		</LinearGradient>
	</View>
);

const styles = StyleSheet.create({
	contentText: {
		top: '33%',
		color: colors.white,
		fontWeight: 'bold',
		fontSize: '20px',
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
