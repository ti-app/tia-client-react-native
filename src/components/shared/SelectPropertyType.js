import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';

export default class SelectPropertyType extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPropertyType: {
				publicProperty: false,
				privateProperty: false,
			},
		};
	}

	componentDidMount() {
		const { presetType } = this.props;

		if (presetType) {
			this.setState({ selectedPropertyType: { ...presetType } });
		}
	}

	componentDidUpdate(prevProps) {
		const { presetType } = this.props;

		if (presetType) {
			const { public: prevPublic, private: prevPrivate } = prevProps.presetType;

			const { public: publicProperty, private: privateProperty } = presetType;

			const presetTypeChanged = publicProperty !== prevPublic || privateProperty !== prevPrivate;

			if (presetTypeChanged) {
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState({ selectedPropertyType: { ...presetType } });
			}
		}
	}

	handleSelection = (field) => {
		const { onSelectedPropertyTypeChange } = this.props;

		this.setState(
			(prevState) => ({
				selectedPropertyType: {
					...{ public: false, private: false }, // First set all values to false
					[field]: !prevState.selectedPropertyType[field], // Then make only single value true
				},
			}),
			() => {
				const { selectedPropertyType } = this.state;
				onSelectedPropertyTypeChange(selectedPropertyType);
			}
		);
	};

	render() {
		const { selectedPropertyType } = this.state;
		const { publicProperty, privateProperty } = selectedPropertyType;

		return (
			<View style={styles.view}>
				<Button
					style={[
						styles.qualityButton,
						styles.qualityButtonLeft,
						publicProperty ? {} : styles.notSelected,
					]}
					onPress={() => this.handleSelection('publicProperty')}
				>
					<Text style={{ textAlign: 'center' }}> PUBLIC </Text>
				</Button>
				<Button
					style={[
						styles.qualityButton,
						styles.qualityButtonRight,
						privateProperty ? {} : styles.notSelected,
					]}
					onPress={() => this.handleSelection('privateProperty')}
				>
					<Text> PRIVATE </Text>
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
