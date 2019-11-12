import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'native-base';

const SelectButton = ({
	onSelectedItemChange,
	presetData,
	data: dataFromProps,
	orientation = 'horizontal',
	atleastOneSelected,
	equallySpaced = true,
	multiple = false,
}) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		if (presetData) {
			setData(presetData);
		}
	}, []);

	useEffect(() => {
		if (dataFromProps) {
			setData(dataFromProps);
		}
	}, [dataFromProps]);

	const handleSelection = (item, itemIndex) => {
		const modifiedData = [...data];
		modifiedData.forEach((aData, index) => {
			if (multiple) {
				if (itemIndex === index) {
					aData.selected = !aData.selected;
				}
			} else {
				if (itemIndex === index) {
					if (atleastOneSelected) {
						aData.selected = true;
					} else {
						aData.selected = !aData.selected;
					}
				} else {
					aData.selected = false;
				}
			}
		});

		setData(modifiedData);

		if (multiple) {
			onSelectedItemChange(modifiedData.filter((_) => _.selected));
		} else {
			onSelectedItemChange(item);
		}
	};

	return (
		<View
			style={[
				styles.view,
				orientation === 'horizontal' ? styles.horizontalOrientation : styles.verticalOrientation,
			]}
		>
			{data.map((aData, index) => {
				const { selected, value, label, status } = aData;
				return (
					<Button
						key={value}
						style={[
							equallySpaced ? styles.itemButton : {},
							selected ? {} : styles.notSelected,
							orientation === 'horizontal' ? styles.itemButtonHorizontal : {},
							orientation === 'horizontal' && index === 0 ? styles.marginLeftZero : {},
							orientation === 'horizontal' && index === data.length - 1
								? styles.marginRightZero
								: {},
						]}
						onPress={() => handleSelection(aData, index)}
						success={status === 'success'}
						warning={status === 'warning'}
						danger={status === 'danger'}
					>
						<Text> {label} </Text>
					</Button>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	view: {
		display: 'flex',
		alignItems: 'center',
	},
	horizontalOrientation: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	verticalOrientation: {
		flexDirection: 'column',
	},
	itemButton: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 10,
	},
	itemButtonHorizontal: {
		marginLeft: 4,
		marginRight: 4,
	},
	marginLeftZero: { marginLeft: 0 },
	marginRightZero: { marginRight: 0 },
	notSelected: {
		opacity: 0.4,
	},
});

export default React.memo(SelectButton);
