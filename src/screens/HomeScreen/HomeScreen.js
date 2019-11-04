import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Icon, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';

import HomeMap from './HomeMap';
import FilterTree from './FilterTree';
import HomeNavigationBar from '../../shared/NavigationBar/HomeNavigationBar';
import AddActionButton from '../../shared/AddActionButton/AddActionButton';
import * as locationActions from '../../store/actions/location.action';
import { selectTreeGroups } from '../../store/reducers/tree.reducer';
import { selectIsFilterOpen } from '../../store/reducers/ui-interactions.reducer';
import * as colors from '../../styles/colors';
import { usePrevious } from '../../utils/customHooks';

const defaultHeaderOptions = {
	headerTitle: <HomeNavigationBar nearbyTreesCount={0} />,
	headerTransparent: true,
	headerStyle: {
		height: 80,
		borderBottomColor: colors.red,
		borderBottomWidth: 2,
		backgroundColor: colors.white,
		opacity: 0.8,
	},
	headerLeft: null,
};

const HomeScreen = (props) => {
	const { navigation } = props;
	const [currentHealthFilter, setCurrentHealthFilter] = useState({
		healthy: true,
		weak: true,
		almostDead: true,
	});
	const [currentRangeFilter, setCurrentRangeFilter] = useState(0.5);
	const [mapRef, setMapRef] = useState(null);

	const isFilterOpen = useSelector(selectIsFilterOpen);
	const treeGroups = useSelector(selectTreeGroups);

	const prevIsFilterOpen = usePrevious(isFilterOpen);
	const prevTreeGroups = usePrevious(treeGroups);

	const dispatch = useDispatch();
	const fetchUserLocation = useCallback(() => dispatch(locationActions.fetchUserLocation()), [
		dispatch,
	]);

	const setDefaultNavigationBar = (nearbyTreesCount = 0) => {
		navigation.setParams({
			header: {
				...defaultHeaderOptions,
				headerTitle: <HomeNavigationBar {...props} nearbyTreesCount={nearbyTreesCount} />,
			},
		});
	};

	useEffect(() => {
		fetchUserLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const changeNavigationBar = isFilterOpen !== prevIsFilterOpen;

		const nearbyTreesCount = treeGroups.reduce((a, b) => a + b.trees.length, 0);
		const prevNearbyTreesCount = prevTreeGroups || [].reduce((a, b) => a + b.trees.length, 0);
		const nearbyTreesCountChanged = nearbyTreesCount !== prevNearbyTreesCount;

		if (changeNavigationBar) {
			if (isFilterOpen) {
				navigation.setParams({ header: { header: null } });
			} else {
				setDefaultNavigationBar(nearbyTreesCount);
			}
		}

		if (nearbyTreesCountChanged && !isFilterOpen) {
			setDefaultNavigationBar(nearbyTreesCount);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [treeGroups, isFilterOpen]);

	const handleMyLocationClick = () => {
		fetchUserLocation();
	};

	const handleOnMapLoad = (ref) => {
		setMapRef(ref);
	};

	const handleFilterChange = ({ range, selectedStatus }) => {
		setCurrentRangeFilter(range);
		setCurrentHealthFilter(selectedStatus);
	};

	return (
		<>
			{isFilterOpen ? (
				<View style={styles.filterContainer}>
					<FilterTree
						currentHealthFilter={currentHealthFilter}
						onFilterChanged={handleFilterChange}
						currentRangeFilter={currentRangeFilter}
					/>
				</View>
			) : null}

			<HomeMap
				currentRangeFilter={currentRangeFilter}
				currentHealthFilter={currentHealthFilter}
				onMapLoad={handleOnMapLoad}
				{...props}
			/>

			<React.Fragment>
				<AddActionButton {...props} mapRef={mapRef} />
				<Icon
					type="MaterialIcons"
					name="my-location"
					style={styles.myLocationIcon}
					onPress={() => {
						handleMyLocationClick();
					}}
				/>
			</React.Fragment>
		</>
	);
};

const styles = StyleSheet.create({
	filterContainer: {
		height: 300,
		backgroundColor: colors.white,
	},
	myLocationIcon: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		fontSize: 40,
		color: colors.black.toString(),
	},
});

HomeScreen.navigationOptions = ({ navigation }) => {
	const header = navigation.getParam('header', defaultHeaderOptions);
	return header;
};

export default HomeScreen;
