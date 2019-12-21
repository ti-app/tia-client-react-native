import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Icon, Button, Text } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';

import HomeMap from './HomeMap';
import FilterTree from './FilterTree';
import AutoCompleteSearch from '../../shared/AutoCompleteSearch/AutoCompleteSearch';
import HomeNavigationBar from '../../shared/NavigationBar/HomeNavigationBar';
import AddActionButton from '../../shared/AddActionButton/AddActionButton';
import * as locationActions from '../../store/actions/location.action';
import * as uiInteractionActions from '../../store/actions/ui-interactions.action';
import { selectTreeGroups } from '../../store/reducers/tree.reducer';
import { selectIsFilterOpen } from '../../store/reducers/ui-interactions.reducer';
import * as colors from '../../styles/colors';
import * as variables from '../../styles/variables';
import { usePrevious, useKeyboardHideHook } from '../../utils/customHooks';
import { selectSearchedLocations } from '../../store/reducers/location.reducer';
import { selectPanic } from '../../store/reducers/panic.reducer';

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
	const [currentPanicNavigationNumber, setCurrentPanicNavigationNumber] = useState(null);

	const [isKeyboardOpen] = useKeyboardHideHook();

	const isFilterOpen = useSelector(selectIsFilterOpen);
	const treeGroups = useSelector(selectTreeGroups);
	const panics = useSelector(selectPanic);
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
	const toggleFilter = useCallback(() => dispatch(uiInteractionActions.toggleFilter()), [dispatch]);

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
		toggleFilter();
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

	const handlePanicNavigatorPress = () => {
		if (mapRef) {
			const [longitude, latitude] = panics[currentPanicNavigationNumber || 0].location.coordinates;
			const mapLocation = {
				latitude,
				longitude,
				latitudeDelta: 0.000882007226706992,
				longitudeDelta: 0.000752057826519012,
			};

			mapRef.animateToRegion(mapLocation, 2000);
			if (!currentPanicNavigationNumber || currentPanicNavigationNumber < panics.length - 1) {
				setCurrentPanicNavigationNumber((currentPanicNavigationNumber || 0) + 1);
			} else {
				setCurrentPanicNavigationNumber(0);
			}
		}
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

			{!isSearchOpen && !isFilterOpen && (
				<TouchableOpacity
					style={styles.leaderboardIconContainer}
					onPress={() => navigation.navigate('Leaderboard')}
				>
					<Icon type="AntDesign" style={[styles.leaderboardIcon]} name="barschart" />
				</TouchableOpacity>
			)}

			{panics && panics.length > 0 && (
				<View style={styles.panicNavigatorButtonContainer}>
					<Button danger style={styles.panicNavigatorButton} onPress={handlePanicNavigatorPress}>
						<Text style={styles.panicInfoText}>There has been panic reported nearby</Text>
						<Text style={styles.takeMetoPanicText}>
							{currentPanicNavigationNumber !== null ? 'Take me to the next' : 'Take me there'}
						</Text>
					</Button>
				</View>
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
		paddingLeft: variables.space.base,
		paddingRight: variables.space.base,
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
	leaderboardIconContainer: {
		position: 'absolute',
		width: variables.space.xxl,
		height: variables.space.xxl,
		borderRadius: variables.space.xxl / 8,
		top: headerHeight + variables.space.base,
		left: variables.space.base,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.purple.toString(),
	},
	leaderboardIcon: {
		fontSize: 25,
		color: colors.white.toString(),
	},
	myLocationIcon: {
		position: 'absolute',
		bottom: 20,
		left: 20,
		fontSize: 40,
		color: colors.black.toString(),
	},
	panicNavigatorButtonContainer: {
		position: 'absolute',
		bottom: variables.space.base,
		alignSelf: 'center',
	},
	panicNavigatorButton: { display: 'flex', flexDirection: 'column' },
	panicInfoText: {
		width: '100%',
		textAlign: 'center',
		color: colors.white,
		fontSize: variables.font.small,
	},
	takeMetoPanicText: {
		width: '100%',
		textAlign: 'center',
		color: colors.white,
		fontSize: variables.font.base,
	},
});

HomeScreen.navigationOptions = ({ navigation }) => {
	const header = navigation.getParam('header', defaultHeaderOptions);
	return header;
};

export default HomeScreen;
