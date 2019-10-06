import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Text, Container } from 'native-base';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';

import Tree from '../../components/Map/Tree';
import FormInput from '../../components/shared/FormInput';
import SelectTreeHealth from '../../components/shared/SelectTreeHealth';
import { setNewTreeGroupData } from '../../store/actions/tree.action';

class AddNewSpotScreen extends React.Component {
	state = {
		centerBias: 0.00015,
	};

	static navigationOptions = () => ({ header: null });

	handlePlantType = (plantType) => {
		const { setNewTreeGroupData } = this.props;
		setNewTreeGroupData({ plantType });
	};

	handleWaterCycleChange = (waterCycle) => {
		const { setNewTreeGroupData } = this.props;
		setNewTreeGroupData({ waterCycle });
	};

	handleSelectedStatusChange = (selectedStatus) => {
		const healthEntry = Object.entries(selectedStatus).find((_) => _[1] === true);
		if (healthEntry && healthEntry[0]) {
			const { setNewTreeGroupData } = this.props;
			setNewTreeGroupData({ health: healthEntry[0] });
		}
	};

	renderTrees = (health) => {
		const { newTreeGroup } = this.props;
		const { trees } = newTreeGroup;
		return trees.map((aCoord, idx) => (
			// eslint-disable-next-line react/no-array-index-key
			<Tree key={idx} coordinate={aCoord} status={health || 'healthy'} />
		));
	};

	render() {
		const { centerBias } = this.state;
		const { userLocation, newTreeGroup } = this.props;
		const { latitude, longitude } = userLocation;
		const { health } = newTreeGroup;

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
						{this.renderTrees(health)}
					</MapView>
				</View>

				<Text style={styles.formTitle}> Add Details </Text>
				<View style={styles.formContainer}>
					<ScrollView contentContainerStyle={styles.form}>
						<FormInput
							placeholder="Plant type"
							keyboardType="default"
							onChangeText={this.handlePlantType}
						/>
						<FormInput
							placeholder="Water cycle"
							keyboardType="number-pad"
							onChangeText={this.handleWaterCycleChange}
						/>
						<View>
							<Text style={styles.paddingBottomTen}> Health of plant(s) </Text>
							<View style={styles.paddingBottomTen}>
								<SelectTreeHealth onSelectedStatusChange={this.handleSelectedStatusChange} />
							</View>
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
	mapViewContainer: { height: '55%' },
	mapView: { height: '100%' },
	formTitle: {
		fontSize: 25,
	},
	formContainer: {
		height: '45%',
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
)(AddNewSpotScreen);
