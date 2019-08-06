import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { connect } from 'react-redux';

import Map from '../Map/Map';
import Tree from '../Map/Tree';
import Spot from '../Map/Spot';
import { fetchTreeGroups, setSelectedTreeDetails } from '../../store/actions/tree.action';

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
		const { latitude: prevUserLat, longitude: prevUserLng } = prevProps.userLocation;
		const { userLocation, fetchTreeGroups } = this.props;
		const { latitude: userLatitude, longitude: userLongitude } = userLocation;

		if ((userLatitude !== prevUserLat || userLongitude !== prevUserLng) && this.mapRef) {
			const mapLocation = {
				latitude: userLatitude,
				longitude: userLongitude,
				latitudeDelta: 0.011582007226706992,
				longitudeDelta: 0.010652057826519012,
			};
			this.mapRef.animateToRegion(mapLocation, 2000);
			fetchTreeGroups(userLocation);
		}
	}

	selectTree(tree) {
		const { navigation, setSelectedTreeDetails } = this.props;
		setSelectedTreeDetails(tree);
		navigation.navigate('TreeDetails');
	}

	renderMarker = (data) => {
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
					this.setState({ splittedTreeGroup: data });
				}}
				health={data.health}
				trees={data.trees}
			/>
		);
	};

	render() {
		const { userLocation, treeGroups } = this.props;

		const { latitude, longitude } = userLocation;
		const { onMapLoad } = this.props;

		const mapData = treeGroups.map((treeGroup) => {
			const { _id, health, location, ...rest } = treeGroup;
			const { coordinates } = location;
			return {
				id: _id,
				health,
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
					{mapData.map((treeGroup) => this.renderMarker(treeGroup))}
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
	isTreeDetailsOpen: state.ui.isTreeDetailsOpen,
});

const mapDispatchToProps = (dispatch) => ({
	setSelectedTreeDetails: (spot) => dispatch(setSelectedTreeDetails(spot)),
	fetchTreeGroups: (...param) => dispatch(fetchTreeGroups(...param)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeMap);
