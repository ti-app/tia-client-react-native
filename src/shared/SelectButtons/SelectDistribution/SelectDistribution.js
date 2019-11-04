import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { usePrevious } from '../../../utils/customHooks';

const SelectDistribution = ({ presetDistribution, onSelectedDistributionChange }) => {
	const [selectedDistribution, setSelectedDistribution] = useState({
		single: false,
		line: false,
	});

	const prevPresetDistribution = usePrevious(presetDistribution);

	useEffect(() => {
		if (presetDistribution && !prevPresetDistribution) {
			setSelectedDistribution(presetDistribution);
		}

		if (presetDistribution && prevPresetDistribution) {
			const { single: prevSingle, line: prevLine } = prevPresetDistribution;

			const { single, line } = presetDistribution;

			const presetDistributionChanged = single !== prevSingle || line !== prevLine;

			if (presetDistributionChanged) {
				setSelectedDistribution(presetDistribution);
			}
		}
	});

	handleSelection = (field) => {
		const newDistribution = {
			...{ single: false, line: false }, // First set all values to false
			[field]: true, // Then make only single value true
		};

		setSelectedDistribution(newDistribution);
		onSelectedDistributionChange(newDistribution);
	};

	const { single, line } = selectedDistribution;

	return (
		<View style={styles.view}>
			<Button
				style={[styles.distributionButton, single ? {} : styles.notSelected]}
				onPress={() => handleSelection('single')}
			>
				<Text style={{ textAlign: 'center' }}> SINGLE </Text>
			</Button>
			<Button
				style={[styles.distributionButton, line ? {} : styles.notSelected]}
				onPress={() => handleSelection('line')}
			>
				<Text> LINE </Text>
			</Button>
		</View>
	);
};

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

export default SelectDistribution;
