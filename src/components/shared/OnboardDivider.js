import React from 'react';
import { StyleSheet, View } from 'react-native';

import ProductText from './ProductText';

import { space } from '../../styles/variables';
import { darkGray } from '../../styles/colors';

const OnboardDivider = ({ style }) => (
	<View style={[styles.container, style]}>
		<View style={[styles.line, styles.left]} />
		<ProductText style={styles.text}>OR</ProductText>
		<View style={[styles.line, styles.right]} />
	</View>
);

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
	},
	line: {
		flex: 1,
		alignSelf: 'center',
		borderWidth: 1,
		borderColor: darkGray,
	},
	left: { marginRight: space.base },
	right: { marginLeft: space.base },
});

export default OnboardDivider;
