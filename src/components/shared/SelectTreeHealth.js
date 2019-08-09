import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';

export default class SelectTreeHealth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedHealthStatus: {
				healthy: false,
				weak: false,
				almostDead: false,
			},
		};
	}

	componentDidMount() {
		const { presetHealthStatus, onSelectedStatusChange } = this.props;

		if (presetHealthStatus) {
			this.setState(
				() => ({ selectedHealthStatus: { ...presetHealthStatus } }),
				() => {
					const { selectedHealthStatus } = this.state;
					onSelectedStatusChange(selectedHealthStatus);
				}
			);
		}
	}

	handleSelection = (field) => {
		const { onSelectedStatusChange } = this.props;

		const { type } = this.props;
		this.setState(
			(prevState) =>
				type === 'multiple'
					? {
							selectedHealthStatus: {
								...prevState.selectedHealthStatus,
								[field]: !prevState.selectedHealthStatus[field],
							},
					  }
					: {
							selectedHealthStatus: {
								...{ healthy: false, weak: false, almostDead: false }, // First set all values to false
								[field]: !prevState.selectedHealthStatus[field], // Then make only single value true
							},
					  },
			() => {
				const { selectedHealthStatus } = this.state;
				onSelectedStatusChange(selectedHealthStatus);
			}
		);
	};

	render() {
		const { selectedHealthStatus } = this.state;
		const { healthy, weak, almostDead } = selectedHealthStatus;

		return (
			<View style={styles.view}>
				<Button
					success
					style={healthy ? null : styles.notSelected}
					onPress={() => this.handleSelection('healthy')}
				>
					<Text> HEALTHY </Text>
				</Button>
				<Button
					warning
					style={weak ? null : styles.notSelected}
					onPress={() => this.handleSelection('weak')}
				>
					<Text> WEAK </Text>
				</Button>
				<Button
					danger
					style={almostDead ? null : styles.notSelected}
					onPress={() => this.handleSelection('almostDead')}
				>
					<Text> ALMOST DEAD </Text>
				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	view: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	notSelected: {
		opacity: 0.4,
	},
});
