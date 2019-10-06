import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';

export default class SelectSoilQualty extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedDistribution: {
				single: false,
				line: false,
			},
		};
	}

	componentDidMount() {
		const { presetDistribution } = this.props;

		if (presetDistribution) {
			this.setState({ selectedDistribution: { ...presetDistribution } });
		}
	}

	componentDidUpdate(prevProps) {
		const { presetDistribution } = this.props;

		if (presetDistribution) {
			const { single: prevSingle, line: prevLine } = prevProps.presetDistribution;

			const { single, line } = presetDistribution;

			const presetDistributionChanged = single !== prevSingle || line !== prevLine;

			if (presetDistributionChanged) {
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState({ selectedDistribution: { ...presetDistribution } });
			}
		}
	}

	handleSelection = (field) => {
		const { onSelectedDistributionChange } = this.props;

		this.setState(
			() => ({
				selectedDistribution: {
					...{ single: false, line: false }, // First set all values to false
					[field]: true, // Then make only single value true
				},
			}),
			() => {
				const { selectedDistribution } = this.state;
				onSelectedDistributionChange(selectedDistribution);
			}
		);
	};

	render() {
		const { selectedDistribution } = this.state;
		const { single, line } = selectedDistribution;

		return (
			<View style={styles.view}>
				<Button
					style={[styles.distributionButton, single ? {} : styles.notSelected]}
					onPress={() => this.handleSelection('single')}
				>
					<Text style={{ textAlign: 'center' }}> SINGLE </Text>
				</Button>
				<Button
					style={[styles.distributionButton, line ? {} : styles.notSelected]}
					onPress={() => this.handleSelection('line')}
				>
					<Text> LINE </Text>
				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	view: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	distributionButton: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 10,
	},
	notSelected: {
		opacity: 0.4,
	},
});
