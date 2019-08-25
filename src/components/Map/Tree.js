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
		const { coordinate, onPress, status } = this.props;
		const { tracksViewChanges, blinkOpacity } = this.state;

		return (
			<Marker tracksViewChanges={tracksViewChanges} coordinate={coordinate} onPress={onPress}>
				<View
					style={{
						...styles.outerCircle,
						backgroundColor: getColorByTreeStatus(status),
					}}
				>
					<View style={styles.innerCircle} />
				</View>
				<Animated.View style={{ ...styles.blinkingOverlay, opacity: blinkOpacity }} />
			</Marker>
		);
	}
}

const styles = StyleSheet.create({
	blinkingOverlay: {
		borderRadius: 7.5,
		width: 15,
		height: 15,
		backgroundColor: colors.gray,
		position: 'absolute',
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
