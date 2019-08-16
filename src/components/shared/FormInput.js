import React from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';

import { space } from '../../styles/variables';
import * as colors from '../../styles/colors';

const FormInput = (props) => {
	const { icon, secondaryIcon, secondaryIconPress } = props;

	return (
		<View style={styles.container}>
			<View style={styles.icon}>{icon}</View>
			<TextInput {...props} placeholderTextColor={colors.gray} style={styles.input} />
			<TouchableOpacity style={styles.secondaryIcon} onPress={secondaryIconPress}>
				{secondaryIcon}
			</TouchableOpacity>
		</View>
	);
};

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: colors.lightGray,
		marginBottom: space.small,
		paddingLeft: space.small,
		paddingRight: space.small,
	},
	icon: {
		opacity: 0.5,
		alignSelf: 'center',
		padding: space.small,
	},
	secondaryIcon: {
		opacity: 0.5,

		display: 'flex',
		flexDirection: 'column',
		alignSelf: 'center',
		padding: space.small,
	},
	input: {
		flex: 1,
		fontFamily: 'product-sans',
		color: colors.black,
		height: 40,
	},
};

export default FormInput;
