import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

export default class Map extends React.Component {
	render() {
		const { onMapLoad } = this.props;

		return (
			<MapView
				ref={(r) => {
					onMapLoad(r);
				}}
				style={styles.map}
				{...this.props}
			/>
		);
	}
}

const styles = StyleSheet.create({
	map: { flex: 1 },
});
