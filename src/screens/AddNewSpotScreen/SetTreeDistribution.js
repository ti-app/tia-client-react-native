import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Container } from 'native-base';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';

import Tree from '../../components/Map/Tree';
import SelectDistribution from '../../components/shared/SelectDistribution';
import { setNewTreeGroupData } from '../../store/actions/tree.action';
import Spot from '../../components/Map/Spot';
import constants from '../../config/common';

const { distributions } = constants;

class SetTreeDistributions extends React.Component {
	state = {
		centerBias: 0.00015,
	};

	static navigationOptions = () => ({ header: null });

	componentDidMount() {
		const { setNewTreeGroupData, userLocation } = this.props;
		const { latitude, longitude } = userLocation;
		setNewTreeGroupData({ trees: [{ latitude, longitude }] });
	}

	handleDistributionChange = (distribution) => {
		const { setNewTreeGroupData, userLocation } = this.props;
		const distributionEntry = Object.entries(distribution).find((_) => _[1] === true);
		if (distributionEntry && distributionEntry[0]) {
			if (distributionEntry[0] === distributions.SINGLE) {
				const { latitude, longitude } = userLocation;
				setNewTreeGroupData({
					trees: [{ latitude, longitude }],
					distribution: distributions.SINGLE,
				});
			} else {
				setNewTreeGroupData({ trees: [], distribution: distributions.LINE });
			}
		}
	};

	render() {
		const { centerBias } = this.state;
		const { userLocation, newTreeGroup } = this.props;
		const { distribution } = newTreeGroup;
		const { latitude, longitude } = userLocation;

		const presetDistribution = { single: false, line: false };
		presetDistribution[distribution] = true;

		return (
			<Container style={styles.container}>
				<View style={styles.mapViewContainer}>
					<MapView
						style={styles.mapView}
						initialRegion={{
							latitude: latitude + centerBias, // Added bias for center of map to align it properly in the viewport, temporary solution. TODO: Think of better way.
							longitude,
							latitudeDelta: 0.000882007226706992,
							longitudeDelta: 0.000752057826519012,
						}}
						scrollEnabled={false}
						pitchEnabled={false}
						rotateEnabled={false}
						zoomEnabled={false}
					>
						{distribution === 'single' && (
							<Tree coordinate={{ latitude, longitude }} status="healthy" />
						)}
						{distribution === 'line' && (
							<Spot coordinate={{ latitude, longitude }} health="healthy" treeCount="?" />
						)}
					</MapView>
				</View>
				<View style={styles.formContainer}>
					<Text style={styles.formTitle}> Select Distribution</Text>
					<ScrollView contentContainerStyle={styles.form}>
						<View style={styles.paddingBottomTen}>
							<SelectDistribution
								presetDistribution={presetDistribution}
								onSelectedDistributionChange={this.handleDistributionChange}
							/>
						</View>
					</ScrollView>
				</View>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	mapViewContainer: { height: '70%' },
	mapView: { height: '100%' },
	formTitle: {
		fontSize: 25,
	},
	formContainer: {
		height: '30%',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		padding: 20,
	},
	paddingBottomTen: {
		paddingBottom: 10,
	},
});

const mapStateToProps = (state) => ({
	userLocation: state.location.userLocation,
	newTreeGroup: state.tree.newTreeGroup,
});

const mapDispatchToProps = (dispatch) => ({
	setNewTreeGroupData: (...params) => dispatch(setNewTreeGroupData(...params)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SetTreeDistributions);
