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
		const { notApproved, deleteNotApproved } = this.props;
		if (notApproved || deleteNotApproved) {
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
		const { notApproved, deleteNotApproved } = this.props;
		if (notApproved || deleteNotApproved) return;

		const { tracksViewChanges } = this.state;
		if (tracksViewChanges) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				tracksViewChanges: false,
			}));
		}
	}

	renderNotApproved = () => {
		const { treeCount } = this.props;
		const { blinkOpacity } = this.state;

		return (
			<Animated.View
				style={{ ...styles.blinkingOverlay, backgroundColor: colors.blue, opacity: blinkOpacity }}
			>
				<Text style={styles.treeCountText}>{treeCount}</Text>
			</Animated.View>
		);
	};

	renderDeleteNotApproved = () => {
		const { treeCount } = this.props;
		const { blinkOpacity } = this.state;

		return (
			<Animated.View
				style={{ ...styles.blinkingOverlay, backgroundColor: colors.blue, opacity: blinkOpacity }}
			>
				<Text style={styles.treeCountText}>{treeCount}</Text>
			</Animated.View>
		);
	};

	renderDefault = () => {
		const { health, treeCount } = this.props;
		return (
			<View style={{ ...styles.treeGroup, backgroundColor: getColorByTreeStatus(health) }}>
				<Text style={styles.treeCountText}>{treeCount}</Text>
			</View>
		);
	};

	renderMarker = () => {
		const { notApproved, deleteNotApproved } = this.props;

		if (notApproved) {
			return this.renderNotApproved();
		}

		if (deleteNotApproved) {
			return this.renderDeleteNotApproved();
		}

		return this.renderDefault();
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
