import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';

export default class SelectSoilQualty extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedSoilQuality: {
				good: false,
				bad: false,
			},
		};
	}

	handleSelection = (field) => {
		const { onSelectedSoilQualityChange } = this.props;

		this.setState(
			(prevState) => ({
				selectedSoilQuality: {
					...{ good: false, bad: false }, // First set all values to false
					[field]: !prevState.selectedSoilQuality[field], // Then make only single value true
				},
			}),
			() => {
				const { selectedSoilQuality } = this.state;
				onSelectedSoilQualityChange(selectedSoilQuality);
			}
		);
	};

	render() {
		const { selectedSoilQuality } = this.state;
		const { good, bad } = selectedSoilQuality;

		return (
			<View style={styles.view}>
				<Button
					success
					style={[styles.qualityButton, styles.qualityButtonLeft, good ? {} : styles.notSelected]}
					onPress={() => this.handleSelection('good')}
				>
					<Text style={{ textAlign: 'center' }}> GOOD </Text>
				</Button>
				<Button
					danger
					style={[styles.qualityButton, styles.qualityButtonRight, bad ? {} : styles.notSelected]}
					onPress={() => this.handleSelection('bad')}
				>
					<Text> BAD </Text>
				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	view: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	qualityButton: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
	},
	qualityButtonLeft: {
		marginRight: 8,
	},
	qualityButtonRight: {
		marginLeft: 8,
	},
	notSelected: {
		opacity: 0.4,
	},
});
