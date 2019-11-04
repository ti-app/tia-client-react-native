import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text, Icon } from 'native-base';
import { useDispatch } from 'react-redux';

import * as uiActions from '../../store/actions/ui-interactions.action';
import * as colors from '../../styles/colors';

const HomeNavigationBar = ({ nearbyTreesCount, navigation }) => {
	const dispatch = useDispatch();
	const toggleFilter = useCallback(() => dispatch(uiActions.toggleFilter()), [dispatch]);

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.menuButton} onPress={() => navigation.toggleDrawer()}>
				<Icon
					type="FontAwesome5"
					style={{ fontSize: 20, color: colors.black.toString() }}
					name="bars"
				/>
			</TouchableOpacity>
			<View style={styles.textContainer}>
				<Text style={styles.title}> Nearby </Text>
				<Text style={styles.info}>
					{nearbyTreesCount} {nearbyTreesCount === 1 ? 'tree' : 'trees'} around you
				</Text>
			</View>
			<TouchableOpacity style={styles.filterButton} onPress={() => toggleFilter()}>
				<Icon
					type="FontAwesome5"
					style={{ fontSize: 20, color: colors.black.toString() }}
					name="filter"
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	textContainer: {
		marginTop: 10,
	},
	title: {
		alignSelf: 'center',
		fontWeight: 'bold',
		fontSize: 18,
	},
	info: {
		alignSelf: 'center',
		fontSize: 18,
	},
	menuButton: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 20,
		paddingLeft: 10,
	},
	filterButton: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		padding: 20,
		paddingRight: 10,
	},
});

export default HomeNavigationBar;
