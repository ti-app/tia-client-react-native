import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';

import Map from '../Map/Map';
import Tree from '../Map/Tree';
import Spot from '../Map/Spot';
import PlantationSite from '../Map/PlantationSite';
import { fetchTreeGroups, setSelectedTreeDetails } from '../../store/actions/tree.action';
import { fetchPlanatationSites } from '../../store/actions/plantation-site.action';

class HomeMap extends React.Component {
	constructor(props) {
		super(props);

		this.mapRef = React.createRef();
		this.state = {
			splittedTreeGroup: null,
		};
	}

	componentDidMount() {}

	componentDidUpdate(prevProps) {
		const {
			currentHealthFilter: prevCurrentHealthFilter,
			currentRangeFilter: prevCurrentRangeFilter,
		} = prevProps;
		const { latitude: prevUserLat, longitude: prevUserLng } = prevProps.userLocation;

		const {
			userLocation,
			fetchTreeGroups,
			fetchPlanatationSites,
			currentRangeFilter,
			currentHealthFilter,
		} = this.props;

		const { latitude: userLatitude, longitude: userLongitude } = userLocation;

		const {
			healthy: prevHealthy,
			weak: prevWeak,
			almostDead: prevAlmostDead,
		} = prevCurrentHealthFilter;

		const { healthy, weak, almostDead } = currentHealthFilter;

		// prettier-ignore
		const healthFilterChanged = healthy !== prevHealthy || weak !== prevWeak || almostDead !== prevAlmostDead;
		// prettier-ignore
		const locationChanged = userLatitude !== prevUserLat || userLongitude !== prevUserLng;
		const rangeChanged = currentRangeFilter !== prevCurrentRangeFilter;

		if ((locationChanged || rangeChanged || healthFilterChanged) && this.mapRef) {
			const mapLocation = {
				latitude: userLatitude,
				longitude: userLongitude,
				latitudeDelta: 0.011582007226706992,
				longitudeDelta: 0.010652057826519012,
			};

			this.mapRef.animateToRegion(mapLocation, 2000);

			fetchTreeGroups(userLocation, currentRangeFilter * 1000, this.getAPIParamForHealth());

			// TODO: This is probably not the right place to fetch plantation site as api doesn't consider the location as of now. We are fetching all the plantation site details.
			fetchPlanatationSites();
		}
	}

	getAPIParamForHealth() {
		const { currentHealthFilter } = this.props;
		const { healthy, weak, almostDead } = currentHealthFilter;
		if (healthy && weak && almostDead) {
			return 'healthy,weak,almostDead';
		}
		if (healthy && almostDead) {
			return 'healthy,almostDead';
		}
		if (healthy && weak) {
			return 'healthy,weak';
		}
		if (weak && almostDead) {
			return 'weak,almostDead';
		}
		if (healthy) {
			return 'healthy';
		}
		if (weak) {
			return 'weak';
		}
		return 'almostDead';
	}

	selectTree(tree) {
		const { navigation, setSelectedTreeDetails } = this.props;
		setSelectedTreeDetails(tree);
		navigation.navigate('TreeDetails');
	}

	renderTrees = (data) => {
		const { splittedTreeGroup } = this.state;

		if (data.trees.length === 1) {
			return (
				<Tree
					key={data.trees[0]._id}
					coordinate={data.location}
					onPress={() => {
						this.selectTree(data.trees[0]);
					}}
					status={data.trees[0].health}
				/>
			);
		}

		if (
			splittedTreeGroup &&
			splittedTreeGroup.id === data.id &&
			JSON.stringify(splittedTreeGroup.trees) === JSON.stringify(data.trees) // TODO: This could create some problem. But right now this is the only faster and easier I can think of.
		) {
			const { trees } = splittedTreeGroup;
			const division = 360 / trees.length;
			const radius = 0.00003;
			const { longitude: centerLng, latitude: centerLat } = data.location;

			return trees.map((tree, i) => {
				const modifiedLng = centerLng + Math.cos(division * (i + 1) * (Math.PI / 180)) * radius;
				const modifiedLat = centerLat + Math.sin(division * (i + 1) * (Math.PI / 180)) * radius;

				return (
					<Tree
						key={tree._id}
						coordinate={{ longitude: modifiedLng, latitude: modifiedLat }}
						onPress={() => {
							this.selectTree(tree);
						}}
						status={tree.health}
					/>
				);
			});
		}

		return (
			<Spot
				key={data.id}
				coordinate={data.location}
				onPress={() => {
					const { longitude, latitude } = data.location;
					const mapLocation = {
						latitude,
						longitude,
						latitudeDelta: 0.000582007226706992,
						longitudeDelta: 0.000252057826519012,
					};
					this.mapRef.animateToRegion(mapLocation, 2000);
					this.setState({ splittedTreeGroup: data });
				}}
				health={data.health}
				treeCount={data.trees.length}
			/>
		);
	};

	renderPlantationSites = (data) => (
		<PlantationSite
			key={data.id}
			coordinate={data.location}
			onPress={() => {
				console.log('Plantation Site Clicked');
				// this.selectPlantationSite(data);
			}}
		/>
	);

	render() {
		const { userLocation, treeGroups, plantationSites } = this.props;

		const { latitude, longitude } = userLocation;
		const { onMapLoad } = this.props;

		const treeData = treeGroups.map((treeGroup) => {
			const { _id, health, location, ...rest } = treeGroup;
			const { coordinates } = location;
			return {
				id: _id,
				health,
				location: { longitude: coordinates[0], latitude: coordinates[1] },
				...rest,
			};
		});

		const plantationSiteData = plantationSites.map((site) => {
			const { _id, location, ...rest } = site;
			const { coordinates } = location;
			return {
				id: _id,
				location: { longitude: coordinates[0], latitude: coordinates[1] },
				...rest,
			};
		});

		return (
			<Container style={styles.container}>
				<Map
					onMapLoad={(ref) => {
						this.mapRef = ref;
						onMapLoad(ref);
					}}
					initialRegion={{
						latitude,
						longitude,
						latitudeDelta: 0.011582007226706992,
						longitudeDelta: 0.010652057826519012,
					}}
					x
					showsUserLocation
					followsUserLocation
					showsMyLocationButton={false}
					showsCompass={false}
				>
					{treeData.map((treeGroup) => this.renderTrees(treeGroup))}
					{plantationSiteData.map((site) => this.renderPlantationSites(site))}
				</Map>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
});

HomeMap.propTypes = {
	userLocation: PropTypes.shape({
		latitude: PropTypes.number.isRequired,
		longitude: PropTypes.number.isRequired,
	}).isRequired,
};

HomeMap.defaultProps = {};

const mapStateToProps = (state) => ({
	userLocation: state.location.userLocation,
	treeGroups: state.tree.treeGroups,
	plantationSites: state.plantationSite.plantationSites,
	isTreeDetailsOpen: state.ui.isTreeDetailsOpen,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedTreeDetails: (spot) => dispatch(setSelectedTreeDetails(spot)),
	fetchTreeGroups: (...param) => dispatch(fetchTreeGroups(...param)),
	fetchPlanatationSites: (...param) => dispatch(fetchPlanatationSites(...param)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeMap);
