import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Marker } from 'react-native-maps';
import * as colors from '../../../styles/colors';
import { getColorByTreeStatus } from '../../../utils/colorMapping';
import { usePrevious } from '../../../utils/customHooks';

const Tree = ({ coordinate, onPress, notApproved, deleteNotApproved, status, commited = true }) => {
	const [tracksViewChanges, setTrackViewChanges] = useState(true);
	const [blinkOpacity] = useState(new Animated.Value(0.01));

	const prevCoordinate = usePrevious(coordinate);
	const prevStatus = usePrevious(status);

	useEffect(() => {
		if (!prevCoordinate) {
			return;
		}
		const { latitude: prevLatitude, longitude: prevLongitude } = prevCoordinate;
		const { latitude, longitude } = coordinate;
		if (latitude !== prevLatitude || longitude !== prevLongitude || prevStatus !== status) {
			setTrackViewChanges(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [coordinate, status]);

	useEffect(() => {
		if (notApproved || deleteNotApproved) {
			startBlinking();
			return;
		}

		if (tracksViewChanges) {
			setTrackViewChanges(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notApproved, deleteNotApproved, status]);

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
			/>
		);
	};

	const renderDeleteNotApproved = () => {
		return (
			<Animated.View
				style={{ ...styles.blinkingOverlay, backgroundColor: colors.red, opacity: blinkOpacity }}
			/>
		);
	};

	const renderDefault = () => {
		return (
			<View
				style={{
					...styles.outerCircle,
					backgroundColor: getColorByTreeStatus(status),
				}}
			>
				<View style={styles.innerCircle} />
				{!commited && <View style={styles.notCommitedDot} />}
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
	notCommitedDot: {
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: colors.red,
		width: 7,
		height: 7,
		borderRadius: 3.5,
	},
});

export default Tree;
