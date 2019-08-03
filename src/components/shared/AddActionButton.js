import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
// import { MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

export default class AddActionButton extends Component {
	state = {
		clicked: false,
	};

	handleOnAddTreePress = () => {
		const { navigation } = this.props;

		navigation.navigate('AddNewSpot');
	};

	handleOnAddPlantationPress = () => {
		const { navigation } = this.props;

		navigation.navigate('AddPlantionSite');
	};

	render() {
		const { clicked } = this.state;
		return (
			<ActionButton
				buttonColor="#00dbb0"
				onPress={() =>
					this.setState((prevState) => ({
						clicked: !prevState.clicked,
					}))
				}
				renderIcon={() =>
					clicked ? (
						<AntDesign name="plus" size={40} style={styles.icon} />
					) : (
						<MaterialIcons name="add-location" size={40} style={styles.icon} />
					)
				}
			>
				<ActionButton.Item buttonColor="#f5a623" title="Coming soon!" onPress={() => {}}>
					<AntDesign name="question" size={40} style={styles.icon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor="#a8a5a0"
					title="New plantation site"
					onPress={this.handleOnAddPlantationPress}
				>
					<Entypo name="flow-tree" size={40} style={styles.icon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor="#4267b2"
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
	icon: { color: '#fff' },
});
