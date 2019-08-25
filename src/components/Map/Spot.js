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
		this.startBlinking();
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
		const { tracksViewChanges } = this.state;
		const { blink } = this.props;

		if (tracksViewChanges && !blink) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				tracksViewChanges: false,
			}));
		}
	}

	render() {
		const { coordinate, onPress, health, treeCount } = this.props;
		const { tracksViewChanges, blinkOpacity } = this.state;

		return (
			<Marker tracksViewChanges={tracksViewChanges} coordinate={coordinate} onPress={onPress}>
				<View style={{ ...styles.treeGroup, backgroundColor: getColorByTreeStatus(health) }}>
					<Text style={styles.treeCountText}>{treeCount}</Text>
				</View>
				<Animated.View style={{ ...styles.blinkingOverlay, opacity: blinkOpacity }} />
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
