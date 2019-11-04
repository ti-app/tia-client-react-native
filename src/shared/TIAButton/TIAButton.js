import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';

import { white } from '../../styles/colors';

const TIAButton = ({ onPress, ...props }) => (
	<Button onPress={onPress} {...props}>
		<Text {...props} style={[styles.text]} />
	</Button>
);

const styles = StyleSheet.create({
	text: {
		color: white,
		alignSelf: 'center',
	},
});

export default TIAButton;
