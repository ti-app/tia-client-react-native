import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { usePrevious } from '../../../utils/customHooks';

const SelectPropertyType = ({ presetType, onSelectedPropertyTypeChange }) => {
	const [selectedPropertyType, setSelectedPropertyType] = useState({
		publicProperty: false,
		privateProperty: false,
	});

	const prevPresetType = usePrevious(presetType);

	useEffect(() => {
		if (presetType && !prevPresetType) {
			setSelectedPropertyType(presetType);
		}

		if (presetType && prevPresetType) {
			const { public: prevPublic, private: prevPrivate } = prevProps.presetType;

			const { public: publicProperty, private: privateProperty } = presetType;

			const presetTypeChanged = publicProperty !== prevPublic || privateProperty !== prevPrivate;

			if (presetTypeChanged) {
				setSelectedPropertyType(presetType);
			}
		}
	});

	const handleSelection = (field) => {
		const newPropertyType = {
			...{ spacing: false, numberOfPlants: false }, // First set all values to false
			[field]: !selectedPropertyType[field], // Then make only single value true
		};
		setSelectedPropertyType(newPropertyType);
		onSelectedPropertyTypeChange(newPropertyType);
	};

	const { publicProperty, privateProperty } = selectedPropertyType;

	return (
		<View style={styles.view}>
			<Button
				style={[
					styles.qualityButton,
					styles.qualityButtonLeft,
					publicProperty ? {} : styles.notSelected,
				]}
				onPress={() => handleSelection('publicProperty')}
			>
				<Text style={{ textAlign: 'center' }}> PUBLIC </Text>
			</Button>
			<Button
				style={[
					styles.qualityButton,
					styles.qualityButtonRight,
					privateProperty ? {} : styles.notSelected,
				]}
				onPress={() => handleSelection('privateProperty')}
			>
				<Text> PRIVATE </Text>
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

export default SelectPropertyType;
