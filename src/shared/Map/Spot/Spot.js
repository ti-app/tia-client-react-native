import React, { useState, useEffect } from 'react';
import { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Animated } from 'react-native';
import * as colors from '../../../styles/colors';
import { getColorByTreeStatus } from '../../../utils/colorMapping';
import { usePrevious } from '../../../utils/customHooks';

const Spot = ({ coordinate, onPress, notApproved, deleteNotApproved, health, treeCount }) => {
	const [tracksViewChanges, setTrackViewChanges] = useState(true);
	const [blinkOpacity] = useState(new Animated.Value(0.01));

	const prevCoordinate = usePrevious(coordinate);

	useEffect(() => {
		let forceUpdate;
		let prevLatitude;
		let prevLongitude;
		if (!prevCoordinate) {
			forceUpdate = true;
		} else {
			prevLatitude = prevCoordinate.latitude;
			prevLongitude = prevCoordinate.longitude;
		}
		const { latitude, longitude } = coordinate;
		if (forceUpdate || latitude !== prevLatitude || longitude !== prevLongitude) {
			setTrackViewChanges(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coordinate]);

	useEffect(() => {
		if (notApproved || deleteNotApproved) {
			startBlinking();
			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notApproved, deleteNotApproved]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (notApproved || deleteNotApproved) {
			return;
		}

		if (tracksViewChanges) {
			setTrackViewChanges(false);
		}
	});

	const startBlinking = () => {
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

	const renderNotApproved = () => {
		return (
			<Animated.View
				style={{ ...styles.blinkingOverlay, backgroundColor: colors.blue, opacity: blinkOpacity }}
			>
				<Text style={styles.treeCountText}>{treeCount}</Text>
			</Animated.View>
		);
	};

	const renderDeleteNotApproved = () => {
		return (
			<Animated.View
				style={{ ...styles.blinkingOverlay, backgroundColor: colors.red, opacity: blinkOpacity }}
			>
				<Text style={styles.treeCountText}>{treeCount}</Text>
			</Animated.View>
		);
	};

	const renderDefault = () => {
		return (
			<View style={{ ...styles.treeGroup, backgroundColor: getColorByTreeStatus(health) }}>
				<Text style={styles.treeCountText}>{treeCount}</Text>
			</View>
		);
	};

	const renderMarker = () => {
		if (notApproved) {
			return renderNotApproved();
		}

		if (deleteNotApproved) {
			return renderDeleteNotApproved();
		}

		return renderDefault();
	};

	return (
		<Marker
			anchor={{ x: 0.5, y: 0.5 }}
			tracksViewChanges={tracksViewChanges}
			coordinate={coordinate}
			onPress={onPress}
		>
			{renderMarker()}
		</Marker>
	);
};

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

export default Spot;
