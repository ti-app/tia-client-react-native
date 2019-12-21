import React from 'react';
import { Circle, Marker } from 'react-native-maps';
import * as colors from '../../../styles/colors';
import { View } from 'native-base';

const PanicMarker = ({ coordinate, data, onPress }) => {
	return (
		<>
			<Circle
				center={coordinate}
				radius={15}
				strokeWidth={1}
				strokeColor={colors.red.toString()}
				fillColor={colors.red.alpha(0.2)}
			/>
			<Circle center={coordinate} strokeWidth={0} radius={5} fillColor={colors.red} />

			<Marker
				coordinate={coordinate}
				anchor={{ x: 0.5, y: 0.5 }}
				onPress={() => {
					onPress(data);
				}}
			>
				<View style={{ width: 100, height: 100, backgroundColor: 'transparent' }}></View>
			</Marker>
		</>
	);
};

export default PanicMarker;
