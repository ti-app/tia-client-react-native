import React from 'react';
import { Circle } from 'react-native-maps';
import * as colors from '../../../styles/colors';

const PanicMarker = ({ coordinate, onPress }) => {
	return (
		<>
			<Circle
				center={coordinate}
				radius={15}
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
