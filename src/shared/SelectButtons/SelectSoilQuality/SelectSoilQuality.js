import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { usePrevious } from '../../../utils/customHooks';

const SelectSoilQualty = ({ presetSoilQuality, onSelectedSoilQualityChange }) => {
	const [selectedSoilQuality, setSelectedSoilQuality] = useState({
		good: false,
		bad: false,
	});

	const prevPresetSoilQuality = usePrevious(presetSoilQuality);

	useEffect(() => {
		if (presetSoilQuality && !prevPresetSoilQuality) {
			setSelectedSoilQuality(presetSoilQuality);
		}

		if (presetSoilQuality && prevPresetSoilQuality) {
			const { good: prevGood, bad: prevBad } = prevProps.presetSoilQuality;

			const { good, bad } = presetSoilQuality;

			const presetSoilQualityChanged = good !== prevGood || bad !== prevBad;

			if (presetSoilQualityChanged) {
				setSelectedSoilQuality(presetSoilQuality);
			}
		}
	});

	const handleSelection = (field) => {
		const newSoilQuality = {
			...{ good: false, bad: false }, // First set all values to false
			[field]: !selectedSoilQuality[field], // Then change only single value
		};
		setSelectedSoilQuality(newSoilQuality);
		onSelectedSoilQualityChange(newSoilQuality);
	};

	const { good, bad } = selectedSoilQuality;

	return (
		<View style={styles.view}>
			<Button
				success
				style={[styles.qualityButton, styles.qualityButtonLeft, good ? {} : styles.notSelected]}
				onPress={() => handleSelection('good')}
			>
				<Text style={{ textAlign: 'center' }}> GOOD </Text>
			</Button>
			<Button
				danger
				style={[styles.qualityButton, styles.qualityButtonRight, bad ? {} : styles.notSelected]}
				onPress={() => handleSelection('bad')}
			>
				<Text> BAD </Text>
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

export default SelectSoilQualty;
