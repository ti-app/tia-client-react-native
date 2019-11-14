import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Slider } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import * as uiActions from '../../store/actions/ui-interactions.action';
import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import * as colors from '../../styles/colors';
import SelectButton from '../../shared/SelectButton/SelectButton';
import {
	selectCurrentStatusList,
	selectCurrentRangeFilter,
} from '../../store/reducers/ui-interactions.reducer';

const FilterTree = ({ onFilterChanged }) => {
	const [range, setRange] = useState(0.5);
	const [selectedStatusList, setSelectedStatusList] = useState(['healthy', 'weak', 'almostDead']);
	const [statusFilterData, setStatusFilterData] = useState([
		{ value: 'healthy', label: 'HEALTHY', status: 'success', selected: true },
		{ value: 'weak', label: 'WEAK', status: 'warning', selected: true },
		{ value: 'almostDead', label: 'ALMOST DEAD', status: 'danger', selected: true },
	]);

	const currentStatusList = useSelector(selectCurrentStatusList);
	const currentRangeFilter = useSelector(selectCurrentRangeFilter);

	const dispatch = useDispatch();
	const toggleFilter = useCallback(() => dispatch(uiActions.toggleFilter()), [dispatch]);

	useEffect(() => {
		if (currentRangeFilter) {
			setRange(currentRangeFilter);
		}

		if (currentStatusList) {
			setStatusFilterDataFromStatusList(currentStatusList);
			setSelectedStatusList(currentStatusList);
		}
	}, [currentStatusList, currentRangeFilter]);

	const handleStatusChange = (itemList) => {
		const statusList = itemList.filter((_) => _.selected).map((_) => _.value);
		setStatusFilterDataFromStatusList(statusList);
		setSelectedStatusList(statusList);
	};

	const setStatusFilterDataFromStatusList = (_statusList) => {
		const modifiedStatusFilterData = statusFilterData.map(({ value, ...rest }) => {
			return { value, ...rest, selected: _statusList.includes(value) };
		});
		setStatusFilterData(modifiedStatusFilterData);
	};

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
						onFilterChanged({ range, selectedStatusList });
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
				<SelectButton
					presetData={statusFilterData}
					data={statusFilterData}
					onSelectedItemChange={handleStatusChange}
					equallySpaced={false}
					multiple
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
