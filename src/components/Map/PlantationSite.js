/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import * as colors from '../../styles/colors';

export default class PlantationSite extends Component {
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
		const { coordinate, onPress } = this.props;
		const { tracksViewChanges } = this.state;

		return (
			<Marker tracksViewChanges={tracksViewChanges} coordinate={coordinate} onPress={onPress}>
				<View style={{ ...styles.plantationSite }} />
			</Marker>
		);
	}
}

const styles = StyleSheet.create({
	plantationSite: {
		width: 30,
		height: 30,
		borderRadius: 15,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.gray,
	},
});
