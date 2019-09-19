/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { getColorByTreeStatus } from '../../utils/ColorMapping';
import * as colors from '../../styles/colors';

export default class Spot extends Component {
	state = {
		tracksViewChanges: true,
		blinkOpacity: new Animated.Value(0.01),
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

	componentDidMount() {
		const { notApproved, deletedNotApproved } = this.props;
		if (notApproved || deletedNotApproved) {
			this.startBlinking();
		}
	}

	startBlinking = () => {
		const { blinkOpacity } = this.state;
		Animated.loop(
			Animated.sequence([
				Animated.timing(blinkOpacity, {
					toValue: 1,
					duration: 200,
				}),
				Animated.timing(blinkOpacity, {
					toValue: 0.01,
					duration: 200,
				}),
			])
		).start();
	};

	componentDidUpdate() {
		const { notApproved, deletedNotApproved } = this.props;
		if (notApproved || deletedNotApproved) return;

		const { tracksViewChanges } = this.state;
		if (tracksViewChanges) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				tracksViewChanges: false,
			}));
		}
	}

	renderMarker = () => {
		const { notApproved, deletedNotApproved, health, treeCount } = this.props;
		const { blinkOpacity } = this.state;

		if (notApproved) {
			return (
				<Animated.View
					style={{ ...styles.blinkingOverlay, backgroundColor: colors.blue, opacity: blinkOpacity }}
				>
					<Text style={styles.treeCountText}>{treeCount}</Text>
				</Animated.View>
			);
		}

		if (deletedNotApproved) {
			return (
				<Animated.View
					style={{ ...styles.blinkingOverlay, backgroundColor: colors.red, opacity: blinkOpacity }}
				>
					<Text style={styles.treeCountText}>{treeCount}</Text>
				</Animated.View>
			);
		}

		return (
			<View style={{ ...styles.treeGroup, backgroundColor: getColorByTreeStatus(health) }}>
				<Text style={styles.treeCountText}>{treeCount}</Text>
			</View>
		);
	};

	render() {
		const { coordinate, onPress } = this.props;
		const { tracksViewChanges } = this.state;

		return (
			<Marker tracksViewChanges={tracksViewChanges} coordinate={coordinate} onPress={onPress}>
				{this.renderMarker()}
			</Marker>
		);
	}
}

const styles = StyleSheet.create({
	blinkingOverlay: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: colors.gray,
		position: 'absolute',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
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
