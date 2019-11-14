import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Icon } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';

import HomeMap from './HomeMap';
import FilterTree from './FilterTree';
import AutoCompleteSearch from '../../shared/AutoCompleteSearch/AutoCompleteSearch';
import HomeNavigationBar from '../../shared/NavigationBar/HomeNavigationBar';
import AddActionButton from '../../shared/AddActionButton/AddActionButton';
import * as locationActions from '../../store/actions/location.action';
import * as uiInteractionActions from '../../store/actions/ui-interactions.action';
import { selectTreeGroups } from '../../store/reducers/tree.reducer';
import {
	selectIsFilterOpen,
	selectCurrentStatusList,
	selectCurrentRangeFilter,
} from '../../store/reducers/ui-interactions.reducer';
import * as colors from '../../styles/colors';
import * as variables from '../../styles/variables';
import { usePrevious, useKeyboardHideHook } from '../../utils/customHooks';
import { selectSearchedLocations } from '../../store/reducers/location.reducer';

const headerHeight = 80;
const defaultHeaderOptions = {
	headerTitle: <HomeNavigationBar nearbyTreesCount={0} />,
	headerTransparent: true,
	headerStyle: {
		height: headerHeight,
		borderBottomColor: colors.red,
		borderBottomWidth: 2,
		backgroundColor: colors.white,
		opacity: 0.8,
	},
	headerLeft: null,
};

const HomeScreen = (props) => {
	const { navigation } = props;
	const [mapRef, setMapRef] = useState(null);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const [isKeyboardOpen] = useKeyboardHideHook();

	const isFilterOpen = useSelector(selectIsFilterOpen);
	const treeGroups = useSelector(selectTreeGroups);
	const searchedLocations = useSelector(selectSearchedLocations);

	const prevIsFilterOpen = usePrevious(isFilterOpen);
	const prevTreeGroups = usePrevious(treeGroups);

	const dispatch = useDispatch();
	const setCurrentRangeFilter = useCallback(
		(_range) => dispatch(uiInteractionActions.setCurrentRangeFilter(_range)),
		[dispatch]
	);
	const setCurrentStatusList = useCallback(
		(_statusList) => dispatch(uiInteractionActions.setCurrentStatusList(_statusList)),
		[dispatch]
	);
	const fetchUserLocation = useCallback(
		(_mapRef) => dispatch(locationActions.fetchUserLocation(_mapRef)),
		[dispatch]
	);
	const fetchSearchedLocations = useCallback(
		(_searchQuery) => dispatch(locationActions.fetchSearchedLocation(_searchQuery)),
		[dispatch]
	);
	const setHomeMapCenterByGooglePlaceId = useCallback(
		(_searchQuery, _mapRef, _cb) =>
			dispatch(locationActions.setHomeMapCenterByGooglePlaceId(_searchQuery, _mapRef, _cb)),
		[dispatch]
	);

	const setDefaultNavigationBar = (nearbyTreesCount = 0) => {
		navigation.setParams({
			header: {
				...defaultHeaderOptions,
				headerTitle: <HomeNavigationBar {...props} nearbyTreesCount={nearbyTreesCount} />,
			},
		});
	};

	useEffect(() => {
		if (mapRef) {
			fetchUserLocation(mapRef);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mapRef]);

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
		fetchUserLocation(mapRef);
	};

	const handleOnMapLoad = (ref) => {
		setMapRef(ref);
	};

	const handleFilterChange = ({ range, selectedStatusList: statusList }) => {
		setCurrentRangeFilter(range);
		setCurrentStatusList(statusList);
	};

	const handleAutoCompleteSearch = (searchQuery) => {
		fetchSearchedLocations(searchQuery);
	};

	const handleSearchedResultPress = (result) => {
		const { placeId } = result;
		setHomeMapCenterByGooglePlaceId(placeId, mapRef, () => {
			setIsSearchOpen(false);
		});
	};

	return (
		<>
			{isFilterOpen ? (
				<View style={styles.filterContainer}>
					<FilterTree onFilterChanged={handleFilterChange} />
				</View>
			) : null}

			<HomeMap onMapLoad={handleOnMapLoad} {...props} />

			<View style={styles.autoCompleteSearchContainer}>
				{isSearchOpen && (
					<AutoCompleteSearch
						onSearch={handleAutoCompleteSearch}
						results={searchedLocations}
						onResultPress={handleSearchedResultPress}
						showClose
						onClose={() => setIsSearchOpen(false)}
					/>
				)}
			</View>

			{!isSearchOpen && !isFilterOpen && (
				<TouchableOpacity
					style={styles.searchActionIconContainer}
					onPress={() => setIsSearchOpen(true)}
				>
					<Icon type="AntDesign" style={[styles.searchIcon]} name="search1" />
				</TouchableOpacity>
			)}

			{!isKeyboardOpen && <AddActionButton {...props} mapRef={mapRef} />}
			{!isKeyboardOpen && (
				<Icon
					type="MaterialIcons"
					name="my-location"
					style={styles.myLocationIcon}
					onPress={() => {
						handleMyLocationClick();
					}}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	filterContainer: {
		height: 300,
		backgroundColor: colors.white,
	},
	autoCompleteSearchContainer: {
		position: 'absolute',
		width: '100%',
		top: headerHeight + variables.space.base,
		display: 'flex',
	},
	searchActionIconContainer: {
		position: 'absolute',
		width: variables.space.xxl,
		height: variables.space.xxl,
		borderRadius: variables.space.xxl / 2,
		top: headerHeight + variables.space.base,
		right: variables.space.base,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.green.toString(),
	},
	searchIcon: {
		fontSize: 20,
		color: colors.white.toString(),
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
