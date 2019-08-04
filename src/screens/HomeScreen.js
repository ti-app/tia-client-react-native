import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HomeDrawer from '../components/Home/Drawer';
import HomeMap from '../components/Home/HomeMap';
import HomeNavigationBar from '../components/Navigation/HomeNavigationBar';
import AddActionButton from '../components/shared/AddActionButton';
import FilterTree from '../components/Home/FilterTree';
import { fetchUserLocation } from '../store/actions/location.action';
import { toggleFilter } from '../store/actions/ui-interactions.action';

const defaultHeaderOptions = {
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
};

class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.mapRef = React.createRef();
	}

	static navigationOptions = ({ navigation }) => {
		const header = navigation.getParam('header', defaultHeaderOptions);
		return header;
	};

	setDefaultNavigationBar(nearbyTreesCount = 0) {
		const { navigation } = this.props;

		navigation.setParams({
			header: {
				...defaultHeaderOptions,
				headerTitle: <HomeNavigationBar nearbyTreesCount={nearbyTreesCount} />,
			},
		});
	}

	componentDidMount() {
		const { fetchUserLocation } = this.props;
		fetchUserLocation();
	}

	componentDidUpdate(prevProps) {
		const { isFilterOpen, navigation, treeGroups } = this.props;
		const changeNavigationBar = isFilterOpen !== prevProps.isFilterOpen;

		const nearbyTreesCount = treeGroups.reduce((a, b) => a + b.trees.length, 0);

		const prevNearbyTreesCount = prevProps.treeGroups.reduce((a, b) => a + b.trees.length, 0);

		const nearbyTreesCountChanged = nearbyTreesCount !== prevNearbyTreesCount;

		if (changeNavigationBar) {
			if (isFilterOpen) {
				navigation.setParams({ header: { header: null } });
			} else {
				console.log('here');
				this.setDefaultNavigationBar(nearbyTreesCount);
			}
		}

		if (nearbyTreesCountChanged && !isFilterOpen) {
			this.setDefaultNavigationBar(nearbyTreesCount);
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
		const { isFilterOpen } = this.props;

		return (
			<HomeDrawer {...this.props}>
				{isFilterOpen ? (
					<View style={styles.filterContainer}>
						<FilterTree />
					</View>
				) : null}

				<HomeMap onMapLoad={this.handleOnMapLoad} {...this.props} />

				<React.Fragment>
					<AddActionButton {...this.props} mapRef={this.mapRef} />
					<TouchableOpacity
						style={styles.myLocationIcon}
						onPress={() => this.handleMyLocationClick()}
					>
						<MaterialIcons name="my-location" size={40} />
					</TouchableOpacity>
				</React.Fragment>
			</HomeDrawer>
		);
	}
}

const styles = StyleSheet.create({
	filterContainer: {
		height: 300,
		backgroundColor: 'white',
	},
	myLocationIcon: {
		position: 'absolute',
		bottom: 32,
		left: 16,
	},
});

const mapStateToProps = (state) => ({
	isFilterOpen: state.ui.isFilterOpen,
	userLocation: state.location.userLocation,
	treeGroups: state.tree.treeGroups,
});

const mapDispatchToProps = (dispatch) => ({
	toggleFilter: () => dispatch(toggleFilter()),
	fetchUserLocation: () => dispatch(fetchUserLocation()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeScreen);
