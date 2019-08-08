import React from 'react';
import { Text } from 'native-base';
import { darkGray } from '../../styles/colors';

export default (props) => {
	const { style } = props;
	return <Text {...props} style={[{ fontFamily: 'product-sans', color: darkGray }, style]} />;
};
