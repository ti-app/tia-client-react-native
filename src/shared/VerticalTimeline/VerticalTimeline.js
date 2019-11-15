import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { View, Text, Icon } from 'native-base';
import * as colors from '../../styles/colors';
import * as variables from '../../styles/variables';

const defaultCircleSize = 16;
const defaultLineWidth = 2;

const VerticalTimeline = ({ data }) => {
	const [xValue, setXValue] = useState(0);

	const _renderItem = ({ item, index }) => (
		<View key={index}>
			<View style={styles.rowContainer}>
				{_renderTime(item, index)}
				{_renderEvent(item, index)}
				{_renderCircle(item, index)}
			</View>
		</View>
	);

	const _renderTime = (rowData) => {
		return (
			<View style={styles.timeContainer}>
				<Text style={styles.time}>{rowData.time}</Text>
			</View>
		);
	};

	const _renderEvent = (rowData, rowID) => {
		return (
			<View
				style={[styles.details]}
				onLayout={(evt) => {
					if (!xValue) {
						const { x } = evt.nativeEvent.layout;
						setXValue(x);
					}
				}}
			>
				<View>
					<View style={styles.detail}>{_renderDetail(rowData, rowID)}</View>
					{_renderSeparator()}
				</View>
			</View>
		);
	};

	const _renderDetail = (rowData) => {
		const { title, description } = rowData;
		return (
			<View style={styles.container}>
				<View>
					<Text style={styles.title}>{title}</Text>
					{description && <Text style={styles.description}>{description}</Text>}
				</View>
			</View>
		);
	};

	const _renderCircle = (rowData, rowID) => {
		const { iconProvider, icon, iconColor } = rowData;
		return (
			<View
				style={[
					styles.circle,
					{
						left: xValue - defaultCircleSize / 2 + (defaultLineWidth - 1) / 2 - variables.space.xs,
					},
				]}
			>
				<Icon type={iconProvider} style={[styles.typeIcon, { color: iconColor }]} name={icon} />
			</View>
		);
	};

	const _renderSeparator = () => <View style={styles.separator} />;

	return (
		<View style={styles.verticalTimeline}>
			<FlatList
				style={styles.listview}
				data={data}
				extraData={data}
				renderItem={_renderItem}
				keyExtractor={(item, index) => index + ''}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	verticalTimeline: { flex: 1 },
	listview: { flex: 1 },
	rowContainer: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		paddingLeft: variables.space.base,
		paddingRight: variables.space.base,
	},
	timeContainer: {
		minWidth: 45,
		paddingRight: variables.space.base,
	},
	time: {
		textAlign: 'right',
		color: colors.blue,
		overflow: 'hidden',
	},
	typeIcon: {
		fontSize: variables.space.base,
		color: colors.black.toString(),
	},
	circle: {
		width: variables.space.large,
		height: variables.space.large,
		backgroundColor: colors.green,
		borderRadius: variables.space.large / 2,
		position: 'absolute',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: colors.text,
	},
	details: {
		borderLeftWidth: defaultLineWidth,
		borderColor: colors.green,
		flexDirection: 'column',
		flex: 1,
	},
	detail: { paddingLeft: variables.space.base, paddingTop: 10, paddingBottom: 10 },
	description: {
		marginTop: 10,
		color: colors.darkGray,
	},
	separator: {
		height: 1,
		backgroundColor: colors.gray,
		marginTop: 10,
		marginBottom: 10,
	},
});

export default VerticalTimeline;
