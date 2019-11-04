import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, Slider } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import * as uiActions from '../../store/actions/ui-interactions.action';
import SelectTreeHealth from '../../shared/SelectButtons/SelectTreeHealth/SelectTreeHealth';
import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import * as colors from '../../styles/colors';

const FilterTree = ({ currentRangeFilter, currentHealthFilter, onFilterChanged }) => {
	const [range, setRange] = useState(0.5);
	const [selectedStatus, setSelectedStatus] = useState({
		healthy: true,
		weak: true,
		almostDead: true,
	});

	const dispatch = useDispatch();
	const toggleFilter = useCallback(() => dispatch(uiActions.toggleFilter()), [dispatch]);

	useEffect(() => {
		if (currentRangeFilter) {
			setRange(currentRangeFilter);
		}

		if (currentHealthFilter) {
			setSelectedStatus(currentHealthFilter);
		}
	}, [currentHealthFilter, currentRangeFilter]);

	return (
		<Container style={styles.container}>
			<OptionsBar
				title="Filters"
				leftOption={{
					label: 'Cancel',
					action: () => toggleFilter(),
				}}
				rightOption={{
					label: 'Save',
					action: () => {
						onFilterChanged({ range, selectedStatus });
					},
				}}
			/>
			<Content style={styles.content}>
				<Text style={styles.textStyle}>How far from you?</Text>
				<View style={styles.view}>
					<Slider
						style={styles.slider}
						step={0.5}
						minimumValue={0.5}
						maximumValue={2.5}
						value={currentRangeFilter}
						onValueChange={(val) => setRange(val)}
						thumbTintColor={colors.blue}
						maximumTrackTintColor={colors.black}
						minimumTrackTintColor={colors.gray}
					/>
				</View>
				<View style={styles.currentRangeView}>
					<Text style={styles.currentRange}>{`${range}km`}</Text>
				</View>
				<Text style={styles.textStyle}>Health of the plant(s)</Text>
				<SelectTreeHealth
					onSelectedStatusChange={(changedStatus) => setSelectedStatus(changedStatus)}
					presetHealthStatus={selectedStatus}
					type="multiple"
				/>
			</Content>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%',
		paddingTop: 10,
		zIndex: 99,
	},
	content: {
		padding: 20,
	},
	cancelButton: {
		color: colors.black,
	},
	saveButton: {
		color: 'green',
	},
	view: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textStyle: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
	},
	slider: {
		padding: 10,
		width: '100%',
	},
	currentRangeView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	currentRange: {
		color: colors.black,
	},
});

export default FilterTree;
