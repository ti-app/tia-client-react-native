import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from 'native-base';
// import Feather from '@expo/vector-icons/Feather';
// import Foundation from '@expo/vector-icons/Foundation';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { toggleDrawer, toggleFilter } from '../../store/actions/ui-interactions.action';

const HomeNavigationBar = ({ nearbyTreesCount, toggleDrawer, toggleFilter }) => (
	<View style={styles.container}>
		<TouchableOpacity style={styles.menuButton} onPress={() => toggleDrawer()}>
			<Ionicons size={20} name="md-menu" />
		</TouchableOpacity>
		<View style={styles.textContainer}>
			<Text style={styles.title}> Nearby </Text>
			<Text style={styles.info}>
				{nearbyTreesCount} {nearbyTreesCount === 1 ? 'tree' : 'trees'} around you
			</Text>
		</View>
		<TouchableOpacity style={styles.filterButton} onPress={() => toggleFilter()}>
			<Foundation size={20} name="filter" />
		</TouchableOpacity>
	</View>
);

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
		paddingLeft: 10,
	},
	filterButton: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		paddingRight: 10,
	},
});

const mapDispatchToProps = (dispatch) => ({
	toggleDrawer: () => dispatch(toggleDrawer()),
	toggleFilter: () => dispatch(toggleFilter()),
});

export default connect(
	null,
	mapDispatchToProps
)(HomeNavigationBar);
