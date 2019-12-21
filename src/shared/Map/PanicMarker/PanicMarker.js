import React, { useState, useEffect } from 'react';
import { Circle } from 'react-native-maps';
import * as colors from '../../../styles/colors';

const PanicMarker = ({ coordinate, onPress }) => {
	const [outerCircleRadius, setOuterCircleRadius] = useState(15);

	useEffect(() => {
		// const intervalId = startAnimation();
		// () => {
		// 	return clearInterval(intervalId);
		// };
	});

	// const startAnimation = () => {
	// 	const intervalId = setInterval(() => {
	// 		if (outerCircleRadius <= 15) {
	// 			setOuterCircleRadius(outerCircleRadius + 1);
	// 		} else {
	// 			setOuterCircleRadius(5);
	// 		}
	// 	}, 1000);
	// 	return intervalId;
	// };

	return (
		<>
			<Circle
				center={coordinate}
				radius={outerCircleRadius}
				strokeWidth={1}
				strokeColor={colors.red.toString()}
				fillColor={colors.red.alpha(0.2)}
			/>
			<Circle
				center={coordinate}
				strokeWidth={0}
				radius={5}
				fillColor={colors.red}
				onPress={onPress}
			/>
		</>
	);
};

export default PanicMarker;
