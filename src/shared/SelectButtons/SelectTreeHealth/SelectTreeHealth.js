import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';
import { usePrevious } from '../../../utils/customHooks';

const SelectTreeHealth = ({ presetHealthStatus, onSelectedStatusChange, type }) => {
	const [selectedHealthStatus, setSelectedHealthStatus] = useState({
		healthy: false,
		weak: false,
		almostDead: false,
	});

	const prevPresetHealthStatus = usePrevious(presetHealthStatus);

	useEffect(() => {
		if (presetHealthStatus && !prevPresetHealthStatus) {
			setSelectedHealthStatus(presetHealthStatus);
		}

		if (presetHealthStatus && prevPresetHealthStatus) {
			const {
				healthy: prevHealthy,
				weak: prevWeak,
				almostDead: prevAlmostDead,
			} = prevPresetHealthStatus;

			const { healthy, weak, almostDead } = presetHealthStatus;

			const presetHealthStatusChanged =
				healthy !== prevHealthy || weak !== prevWeak || almostDead !== prevAlmostDead;

			if (presetHealthStatusChanged) {
				setSelectedHealthStatus(presetHealthStatus);
			}
		}
	});

	const handleSelection = (field) => {
		const newHealthStatus =
			type === 'multiple'
				? {
						...selectedHealthStatus,
						[field]: !selectedHealthStatus[field],
				  }
				: {
						...{ healthy: false, weak: false, almostDead: false }, // First set all values to false
						[field]: !selectedHealthStatus[field], // Then make only single value true
				  };
		setSelectedHealthStatus(newHealthStatus);
		onSelectedStatusChange(newHealthStatus);
	};

	const { healthy, weak, almostDead } = selectedHealthStatus;

	return (
		<View style={styles.view}>
			<Button
				success
				style={healthy ? null : styles.notSelected}
				onPress={() => handleSelection('healthy')}
			>
				<Text> HEALTHY </Text>
			</Button>
			<Button
				warning
				style={weak ? null : styles.notSelected}
				onPress={() => handleSelection('weak')}
			>
				<Text> WEAK </Text>
			</Button>
			<Button
				danger
				style={almostDead ? null : styles.notSelected}
				onPress={() => handleSelection('almostDead')}
			>
				<Text> ALMOST DEAD </Text>
			</Button>
		</View>
	);
};

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

export default SelectTreeHealth;
