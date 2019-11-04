import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { usePrevious } from '../../../utils/customHooks';

const SelectLineDistParam = ({ presetDistParams, onSelectedDistParamChange }) => {
	const [selectedLineDistParam, setSelectedLineDistParam] = useState({
		spacing: false,
		numberOfPlants: false,
	});

	const prevPresetDistParams = usePrevious(presetDistParams);
	const prevSelectedLineDistParam = usePrevious(selectedLineDistParam);

	useEffect(() => {
		if (presetDistParams && !prevPresetDistParams) {
			setSelectedLineDistParam(presetDistParams);
		}

		if (presetDistParams && prevPresetDistParams) {
			const { spacing: prevSpacing, numberOfPlants: prevNumberOfPlants } = prevPresetDistParams;

			const { spacing, numberOfPlants } = presetDistParams;

			const presetDistParamsChanged =
				spacing !== prevSpacing || numberOfPlants !== prevNumberOfPlants;

			if (presetDistParamsChanged) {
				setSelectedLineDistParam(presetDistParams);
			}
		}
	});

	const handleSelection = (field) => {
		const newLineDistParam = {
			...{ spacing: false, numberOfPlants: false }, // First set all values to false
			[field]: !prevSelectedLineDistParam[field], // Then make only single value true
		};
		setSelectedLineDistParam(newLineDistParam);
		onSelectedDistParamChange(newLineDistParam);
	};

	const { spacing, numberOfPlants } = selectedLineDistParam;

	return (
		<View style={styles.view}>
			<Button
				style={[styles.qualityButton, styles.qualityButtonLeft, spacing ? {} : styles.notSelected]}
				onPress={() => handleSelection('spacing')}
			>
				<Text style={{ textAlign: 'center' }}> SPACING </Text>
			</Button>
			<Button
				style={[
					styles.qualityButton,
					styles.qualityButtonRight,
					numberOfPlants ? {} : styles.notSelected,
				]}
				onPress={() => handleSelection('numberOfPlants')}
			>
				<Text> NUMBER OF PLANTS </Text>
			</Button>
		</View>
	);
};

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

export default SelectLineDistParam;
