import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Container, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import MapView, { Polyline } from 'react-native-maps';

import SelectLineDistParam from '../../components/shared/SelectLineDistParam';
import Tree from '../../components/Map/Tree';
import FormInput from '../../components/shared/FormInput';
import ProductText from '../../components/shared/ProductText';
import { setNewTreeGroupData } from '../../store/actions/tree.action';
import { fetchUserLocation } from '../../store/actions/location.action';
import { getTreeCoordsByNumberOfTrees, getTreeCoordsBySpacing } from '../../utils/Geo';
import * as colors from '../../styles/colors';

const renderTrees = (coordinates) =>
	// eslint-disable-next-line react/no-array-index-key
	coordinates.map((aCoord, idx) => <Tree key={idx} coordinate={aCoord} status="healthy" />);

class AddNewSpotScreen extends React.Component {
	state = {
		centerBias: 0.00015,
		type: 'spacing', // should be one of 'spacing' or 'numberOfPlants'
		spacing: 0, // in meters
		numberOfPlants: 0,
		endpoints: [],
		treeCoordinates: [],
	};

	static navigationOptions = () => ({ header: null });

	componentWillMount() {
		const { fetchUserLocation } = this.props;
		fetchUserLocation();
	}

	handleSpacingChange = (spacing) => {
		this.setState({ spacing }, () => {
			this.calculateTreeCoordinates();
		});
	};

	handleNumberOfPlantsChange = (numberOfPlants) => {
		this.setState({ numberOfPlants }, () => {
			this.calculateTreeCoordinates();
		});
	};

	handleDistParamChange = (type) => {
		const typeEntry = Object.entries(type).find((_) => _[1] === true);
		if (typeEntry && typeEntry[0]) {
			this.setState({ type: typeEntry[0] }, () => {
				this.calculateTreeCoordinates();
			});
		}
	};

	calculateTreeCoordinates = () => {
		const { endpoints, type, spacing, numberOfPlants } = this.state;
		if (endpoints.length === 2) {
			let modifiedTrees = [];

			if (type === 'spacing') {
				if (spacing > 0) {
					modifiedTrees = getTreeCoordsBySpacing(endpoints, spacing);
				}
			} else {
				modifiedTrees = getTreeCoordsByNumberOfTrees(endpoints, numberOfPlants);
			}

			this.setState({ treeCoordinates: modifiedTrees });
		}
	};

	handleMapPress = (e) => {
		const { coordinate: newCoordinate } = e.nativeEvent;
		const { endpoints } = this.state;

		const modifiedEndpoints = [...endpoints];

		if (modifiedEndpoints.length) {
			modifiedEndpoints[0] = modifiedEndpoints.pop();
		}

		modifiedEndpoints.push(newCoordinate);

		this.setState({ endpoints: modifiedEndpoints });
	};

	getInstruction = () => {
		const { endpoints, type, spacing, numberOfPlants } = this.state;
		switch (true) {
			case !endpoints[0]:
				return '1. Tap on a map to select start point of line.';
			case !endpoints[1]:
				return '2. Tap on a map to select end point of line.';
			case type === 'spacing' && spacing <= 0:
				return '3. Enter spacing (more than 0) in meters or change map distribution to "Number of plants"';
			case type === 'numberOfPlants' && numberOfPlants < 2:
				return '3. Enter number of plants (more than 2) or change map distribution to "spacing"';
			case type === 'spacing' && spacing > 0:
				return '4. All set! Continue or change map distribution to "NUMBER OF PLANTS"';
			case type === 'numberOfPlants' && numberOfPlants >= 2:
				return '4. All set! Continue or change map distribution to "SPACING"';
			default:
				return '';
		}
	};

	handleClear = () => {
		this.setState({ endpoints: [], treeCoordinates: [] });
	};

	render() {
		const { centerBias, type, spacing, numberOfPlants, endpoints, treeCoordinates } = this.state;
		const { userLocation } = this.props;
		const { latitude, longitude } = userLocation;

		const presetDistParams = { spacing: false, numberOfPlants: false };
		presetDistParams[type] = true;

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
						onPress={this.handleMapPress}
						moveOnMarkerPress={false}
					>
						{endpoints[0] && <Tree coordinate={endpoints[0]} status="healthy" />}
						{endpoints[1] && <Tree coordinate={endpoints[1]} status="healthy" />}
						{endpoints.length === 2 && (
							<Polyline
								coordinates={endpoints}
								strokeColor={colors.purple} // fallback for when `strokeColors` is not supported by the map-provider
								strokeWidth={3}
							/>
						)}
						{renderTrees(treeCoordinates)}
					</MapView>
					<ProductText style={styles.instruction}>{this.getInstruction()}</ProductText>
					{endpoints[0] && (
						<Button danger style={styles.clearButton} onPress={this.handleClear}>
							<Text> Reset </Text>
						</Button>
					)}
				</View>

				<View style={styles.formContainer}>
					<ProductText style={styles.formTitle}> Select Tree Locations </ProductText>
					<ScrollView contentContainerStyle={styles.form}>
						<ProductText>Distribute trees along line by:</ProductText>
						<SelectLineDistParam
							presetDistParams={presetDistParams}
							onSelectedDistParamChange={this.handleDistParamChange}
						/>
						<ProductText>
							{type === 'spacing' && 'Enter spacing'}
							{type === 'numberOfPlants' && 'Enter number of plants'}
						</ProductText>
						{type === 'spacing' && (
							<FormInput
								style={[styles.textInput, styles.paddingBottomTen]}
								keyboardType="number-pad"
								placeholder="Enter spacing"
								onChangeText={this.handleSpacingChange}
								value={String(spacing)}
							/>
						)}
						{type === 'numberOfPlants' && (
							<FormInput
								style={styles.textInput}
								keyboardType="number-pad"
								placeholder="Enter number of plants"
								onChangeText={this.handleNumberOfPlantsChange}
								value={String(numberOfPlants)}
							/>
						)}
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
	mapViewContainer: { height: '70%', position: 'relative' },
	instruction: {
		position: 'absolute',
		bottom: 0,
		width: '60%',
		alignSelf: 'center',
		textAlign: 'center',
		fontWeight: 'bold',
		color: colors.blue,
	},
	clearButton: {
		position: 'absolute',
		top: 10,
		right: 10,
	},
	mapView: { height: '100%' },
	formContainer: { height: '30%' },
	formTitle: {
		fontSize: 25,
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
	fetchUserLocation: () => dispatch(fetchUserLocation()),
	setNewTreeGroupData: (...params) => dispatch(setNewTreeGroupData(...params)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddNewSpotScreen);
