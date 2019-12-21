import React, { useState, useEffect } from 'react';
import { Marker } from 'react-native-maps';
import { StyleSheet, View, Animated } from 'react-native';

import * as colors from '../../../styles/colors';
import { usePrevious } from '../../../utils/customHooks';

const PlantationSite = ({ coordinate, onPress, notApproved, deleteNotApproved }) => {
	const [tracksViewChanges, setTrackViewChanges] = useState(true);
	const [blinkOpacity] = useState(new Animated.Value(0.01));

	const prevCoordinate = usePrevious(coordinate);

	useEffect(() => {
		if (!prevCoordinate) {
			return;
		}

		const { latitude: prevLatitude, longitude: prevLongitude } = prevCoordinate;
		const { latitude, longitude } = coordinate;

		if (latitude !== prevLatitude || longitude !== prevLongitude) {
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

	const renderDefault = () => <View style={{ ...styles.plantationSite }} />;

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
		<Marker tracksViewChanges={tracksViewChanges} coordinate={coordinate} onPress={onPress}>
			{renderMarker()}
		</Marker>
	);
};

const styles = StyleSheet.create({
	blinkingOverlay: {
		width: 20,
		height: 20,
		borderRadius: 4,
		backgroundColor: colors.gray,
	},
	plantationSite: {
		width: 20,
		height: 20,
		borderRadius: 4,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.maroon,
	},
});

export default PlantationSite;
