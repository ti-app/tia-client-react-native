/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { getColorByTreeStatus } from '../../utils/ColorMapping';

export default class Spot extends Component {
	state = {
		tracksViewChanges: true,
	};

	componentWillReceiveProps(nextProps) {
		const {
			coordinate: { latitude: prevLatitude, longitude: prevLongitude },
		} = this.props;
		const { latitude, longitude } = nextProps;
		if (latitude !== prevLatitude || longitude !== prevLongitude) {
			this.setState(() => ({
				tracksViewChanges: true,
			}));
		}
	}

	componentDidUpdate() {
		const { tracksViewChanges } = this.state;
		if (tracksViewChanges) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				tracksViewChanges: false,
			}));
		}
	}

	render() {
		const { coordinate, onPress, health, treeCount } = this.props;
		const { tracksViewChanges } = this.state;

		return (
			<Marker tracksViewChanges={tracksViewChanges} coordinate={coordinate} onPress={onPress}>
				<View style={{ ...styles.treeGroup, backgroundColor: getColorByTreeStatus(health) }}>
					<Text style={styles.treeCountText}>{treeCount}</Text>
				</View>
			</Marker>
		);
	}
}

const styles = StyleSheet.create({
	treeGroup: {
		width: 20,
		height: 20,
		borderRadius: 10,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	treeCountText: {
		color: 'white',
	},
});
