import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';

export default class SelectLineDistParam extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLineDistParam: {
				spacing: false,
				numberOfPlants: false,
			},
		};
	}

	componentDidMount() {
		const { presetDistParams } = this.props;

		if (presetDistParams) {
			this.setState({ selectedLineDistParam: { ...presetDistParams } });
		}
	}

	componentDidUpdate(prevProps) {
		const { presetDistParams } = this.props;

		if (presetDistParams) {
			const {
				spacing: prevSpacing,
				numberOfPlants: prevNumberOfPlants,
			} = prevProps.presetDistParams;

			const { spacing, numberOfPlants } = presetDistParams;

			const presetDistParamsChanged =
				spacing !== prevSpacing || numberOfPlants !== prevNumberOfPlants;

			if (presetDistParamsChanged) {
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState({ selectedLineDistParam: { ...presetDistParams } });
			}
		}
	}

	handleSelection = (field) => {
		const { onSelectedDistParamChange } = this.props;

		this.setState(
			(prevState) => ({
				selectedLineDistParam: {
					...{ spacing: false, numberOfPlants: false }, // First set all values to false
					[field]: !prevState.selectedLineDistParam[field], // Then make only single value true
				},
			}),
			() => {
				const { selectedLineDistParam } = this.state;
				onSelectedDistParamChange(selectedLineDistParam);
			}
		);
	};

	render() {
		const { selectedLineDistParam } = this.state;
		const { spacing, numberOfPlants } = selectedLineDistParam;

		return (
			<View style={styles.view}>
				<Button
					style={[
						styles.qualityButton,
						styles.qualityButtonLeft,
						spacing ? {} : styles.notSelected,
					]}
					onPress={() => this.handleSelection('spacing')}
				>
					<Text style={{ textAlign: 'center' }}> SPACING </Text>
				</Button>
				<Button
					style={[
						styles.qualityButton,
						styles.qualityButtonRight,
						numberOfPlants ? {} : styles.notSelected,
					]}
					onPress={() => this.handleSelection('numberOfPlants')}
				>
					<Text> NUMBER OF PLANTS </Text>
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
