import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { connect } from 'react-redux';
// import { MaterialIcons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeDrawer from '../components/Home/Drawer';
import HomeMap from '../components/Home/HomeMap';
import HomeNavigationBar from '../components/Navigation/HomeNavigationBar';
import AddActionButton from '../components/shared/AddActionButton';
import FilterTree from '../components/Home/FilterTree';
import TreeDetails from '../components/Home/TreeDetails';
import { fetchUserLocation } from '../store/actions/location.action';
import OptionsBar from '../components/Navigation/OptionsBar';
import SpotDetailsNavBar from '../components/Navigation/SpotDetailsNavBar';
import { toggleFilter, toggleTreeDetails } from '../store/actions/ui-interactions.action';

class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.mapRef = React.createRef();
		this.state = {
			defaultHeaderOptions: {
				headerTitle: <HomeNavigationBar nearbyTreesCount={0} />,
				headerTransparent: true,
				headerStyle: {
					height: 80,
					borderBottomColor: 'red',
					backgroundColor: '#ffff',
					opacity: 0.8,
				},
				headerLeft: null,
			},
		};
	}

	static navigationOptions = ({ navigation }) => {
		const header = navigation.getParam('header', {
			headerTitle: <HomeNavigationBar nearbyTreesCount={0} />,
			headerTransparent: true,
			headerStyle: {
				height: 80,
				borderBottomColor: 'red',
				borderBottomWidth: 2,
				backgroundColor: '#ffff',
				opacity: 0.8,
			},
			headerLeft: null,
		});
		return header;
	};

	componentDidMount() {
		const { fetchUserLocation } = this.props;
		fetchUserLocation();
	}

	componentDidUpdate(prevProps) {
		const {
			isFilterOpen,
			toggleFilter,
			navigation,
			isTreeDetailsOpen,
			toggleTreeDetails,
			treeGroups,
		} = this.props;
		const { defaultHeaderOptions } = this.state;
		const { headerStyle: defaultHeaderStyle } = defaultHeaderOptions;

		const changeNavigationBar =
			isFilterOpen !== prevProps.isFilterOpen || isTreeDetailsOpen !== prevProps.isTreeDetailsOpen;
		const isFilterOrTreeDetailsNavBar = isFilterOpen || isTreeDetailsOpen;
		const nearbyTreesCount = treeGroups.reduce((a, b) => {
			return a + b.trees.length;
		}, 0);
		const prevNearbyTreesCount = prevProps.treeGroups.reduce((a, b) => {
			return a + b.trees.length;
		}, 0);
		if (changeNavigationBar) {
			navigation.setParams({
				header: {
					...defaultHeaderOptions,
					headerStyle: {
						...defaultHeaderStyle,
						borderBottomWidth: isFilterOrTreeDetailsNavBar ? 0 : 2,
					},
					headerTitle: (() => {
						switch (true) {
							case isFilterOpen:
								return (
									<OptionsBar
										title="Filters"
										leftOption={{ label: 'Cancel', action: () => toggleFilter() }}
										rightOption={{
											label: 'Save',
											action: () => {
												console.log('Save filter option and do something with it');
											},
										}}
									/>
								);
							case isTreeDetailsOpen:
								return <SpotDetailsNavBar leftOption={{ action: () => toggleTreeDetails() }} />;
							default:
								return <HomeNavigationBar nearbyTreesCount={nearbyTreesCount} />;
						}
					})(),
				},
			});
		} else if (nearbyTreesCount !== prevNearbyTreesCount && !isFilterOpen && !isTreeDetailsOpen) {
			navigation.setParams({
				header: {
					...defaultHeaderOptions,
					headerTitle: <HomeNavigationBar nearbyTreesCount={nearbyTreesCount} />,
				},
			});
		}
	}

	handleMyLocationClick() {
		const { fetchUserLocation } = this.props;
		fetchUserLocation();
	}

	handleOnMapLoad = (ref) => {
		this.mapRef = ref;
	};

	render() {
		const { isFilterOpen, isTreeDetailsOpen } = this.props;

		return (
			<HomeDrawer {...this.props}>
				{isFilterOpen ? (
					<View style={styles.filterContainer}>
						<FilterTree />
					</View>
				) : null}
				<HomeMap onMapLoad={this.handleOnMapLoad} {...this.props} />
				{isTreeDetailsOpen ? (
					<View style={styles.TreeDetailsContainer}>
						<TreeDetails />
					</View>
				) : (
					<React.Fragment>
						<AddActionButton {...this.props} mapRef={this.mapRef} />
						<TouchableOpacity
							style={styles.myLocationIcon}
							onPress={() => this.handleMyLocationClick()}
						>
							<MaterialIcons name="my-location" size={40} />
						</TouchableOpacity>
					</React.Fragment>
				)}
			</HomeDrawer>
		);
	}
}

const styles = StyleSheet.create({
	filterContainer: {
		height: 380,
		backgroundColor: 'white',
	},
	myLocationIcon: {
		position: 'absolute',
		bottom: 32,
		left: 16,
	},
	TreeDetailsContainer: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		height: 400,
		backgroundColor: 'white',
		width: '100%',
	},
});

const mapStateToProps = (state) => ({
	isFilterOpen: state.ui.isFilterOpen,
	userLocation: state.location.userLocation,
	isTreeDetailsOpen: state.ui.isTreeDetailsOpen,
	treeGroups: state.tree.treeGroups,
});

const mapDispatchToProps = (dispatch) => ({
	toggleFilter: () => dispatch(toggleFilter()),
	fetchUserLocation: () => dispatch(fetchUserLocation()),
	toggleTreeDetails: () => dispatch(toggleTreeDetails()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeScreen);
