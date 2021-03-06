import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import * as colors from '../../styles/colors';

export default class AddActionButton extends Component {
	handleOnAddTreePress = () => {
		const { navigation } = this.props;

		navigation.navigate('AddNewSpot');
	};

	handleOnAddPlantationPress = () => {
		const { navigation } = this.props;

		navigation.navigate('AddPlantationSite');
	};

	render() {
		return (
			<ActionButton
				buttonColor={colors.green.toString()}
				renderIcon={(active) =>
					active ? (
						<AntDesign name="plus" size={40} style={styles.icon} />
					) : (
						<MaterialIcons name="add-location" size={40} style={styles.icon} />
					)
				}
			>
				<ActionButton.Item
					buttonColor={colors.orange.toString()}
					title="Coming soon!"
					onPress={() => {}}
				>
					<AntDesign name="question" size={40} style={styles.icon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor={colors.gray.toString()}
					title="New plantation site"
					onPress={this.handleOnAddPlantationPress}
				>
					<Entypo name="flow-tree" size={40} style={styles.icon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor={colors.blue.toString()}
					title="Add a tree"
					onPress={this.handleOnAddTreePress}
				>
					<Entypo name="tree" size={40} style={styles.icon} />
				</ActionButton.Item>
			</ActionButton>
		);
	}
}

const styles = StyleSheet.create({
	icon: { color: colors.white },
});
