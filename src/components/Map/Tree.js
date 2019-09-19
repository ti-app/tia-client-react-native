import React, { PureComponent } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import { getColorByTreeStatus } from '../../utils/ColorMapping';
import * as colors from '../../styles/colors';

export default class Tree extends PureComponent {
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

	renderMarker = () => {
		const { notApproved, deleteNotApproved, status } = this.props;
		const { blinkOpacity } = this.state;

		if (notApproved) {
			return (
				<Animated.View
					style={{ ...styles.blinkingOverlay, backgroundColor: colors.blue, opacity: blinkOpacity }}
				/>
			);
		}

		if (deleteNotApproved) {
			return (
				<Animated.View
					style={{ ...styles.blinkingOverlay, backgroundColor: colors.red, opacity: blinkOpacity }}
				/>
			);
		}

		return (
			<View
				style={{
					...styles.outerCircle,
					backgroundColor: getColorByTreeStatus(status),
				}}
			>
				<View style={styles.innerCircle} />
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
		width: 15,
		height: 15,
		borderRadius: 7.5,
		backgroundColor: colors.gray,
	},
	outerCircle: {
		backgroundColor: colors.green,
		padding: 0,
		borderRadius: 7.5,
		width: 15,
		height: 15,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	innerCircle: {
		backgroundColor: colors.white,
		width: 10,
		height: 10,
		borderRadius: 5,
	},
});
