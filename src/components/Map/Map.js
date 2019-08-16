import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import MapView from 'react-native-maps';

export default class Map extends React.Component {
	render() {
		const { onMapLoad } = this.props;

		return (
			<>
				<MapView
					ref={(r) => {
						onMapLoad(r);
					}}
					style={styles.map}
					{...this.props}
				/>
				<View style={styles.mapDrawerOverlay} />
			</>
		);
	}
}

const styles = StyleSheet.create({
	map: { flex: 1 },
	mapDrawerOverlay: {
		position: 'absolute',
		left: 0,
		top: 0,
		opacity: 0.0,
		height: Dimensions.get('window').height,
		width: 10,
	},
});
