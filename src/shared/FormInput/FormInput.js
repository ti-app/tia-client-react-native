import React from 'react';
import { TextInput, View, TouchableOpacity, Alert } from 'react-native';

import { space } from '../../styles/variables';
import * as colors from '../../styles/colors';
import * as variables from '../../styles/variables';
import { Icon } from 'native-base';

const FormInput = (props) => {
	const { icon, secondaryIcon, secondaryIconPress, style, info } = props;

	const handleInfoIconPress = () => {
		Alert.alert('Help', info, [
			{
				text: 'OK',
			},
		]);
	};

	return (
		<View style={[styles.container, style]}>
			<View style={styles.icon}>{icon}</View>
			<TextInput {...props} placeholderTextColor={colors.gray} style={styles.input} />
			<TouchableOpacity style={styles.secondaryIcon} onPress={secondaryIconPress}>
				{secondaryIcon}
			</TouchableOpacity>
			{info && (
				<TouchableOpacity style={styles.infoIconContainer} onPress={handleInfoIconPress}>
					<Icon type="Feather" style={styles.infoIcon} name="info" />
				</TouchableOpacity>
			)}
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
	infoIconContainer: {
		opacity: 0.5,

		display: 'flex',
		flexDirection: 'column',
		alignSelf: 'center',
		padding: space.small,
	},
	infoIcon: { fontSize: variables.font.large, color: colors.black.toString() },
	input: {
		flex: 1,
		fontFamily: 'product-sans',
		color: colors.black,
		height: 40,
	},
};

export default FormInput;
