import React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'native-base';
import ActionButton from 'react-native-action-button';

import * as colors from '../../styles/colors';

const AddActionButton = ({ navigation }) => {
	const handleOnAddTreePress = () => {
		navigation.navigate('AddNewSpot');
	};

	const handleOnAddPlantationPress = () => {
		navigation.navigate('AddPlantationSite');
	};

	const handleOnPanicPress = () => {
		navigation.navigate('CreatePanic');
	};

	return (
		<ActionButton
			buttonColor={colors.green.toString()}
			renderIcon={(active) =>
				active ? (
					<Icon type="Entypo" name="plus" style={styles.icon} />
				) : (
					<Icon type="Entypo" name="tree" style={styles.icon} />
				)
			}
		>
			<ActionButton.Item
				buttonColor={colors.orange.toString()}
				title="Coming soon!"
				onPress={() => {}}
			>
				<Icon type="FontAwesome5" name="question" style={styles.icon} />
			</ActionButton.Item>
			<ActionButton.Item
				buttonColor={colors.red.toString()}
				title="Report Panic"
				onPress={handleOnPanicPress}
			>
				<Icon type="MaterialIcons" name="report-problem" style={styles.icon} />
			</ActionButton.Item>
			<ActionButton.Item
				buttonColor={colors.gray.toString()}
				title="New plantation site"
				onPress={handleOnAddPlantationPress}
			>
				<Icon type="FontAwesome5" name="map" style={styles.icon} />
			</ActionButton.Item>
			<ActionButton.Item
				buttonColor={colors.blue.toString()}
				title="Add a tree"
				onPress={handleOnAddTreePress}
			>
				<Icon type="Entypo" name="tree" style={styles.icon} />
			</ActionButton.Item>
		</ActionButton>
	);
};

const styles = StyleSheet.create({
	icon: { color: colors.white, fontSize: 40 },
});

export default AddActionButton;
