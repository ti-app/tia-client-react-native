import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { getColorByTreeStatus } from '../../utils/ColorMapping';

export default class Tree extends PureComponent {
	state = {
		tracksViewChanges: true,
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

	componentDidUpdate() {
		const { tracksViewChanges } = this.state;
		if (tracksViewChanges) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				tracksViewChanges: false,
			}));
		}
	}

	render() {
		const { coordinate, onPress, status } = this.props;
		const { tracksViewChanges } = this.state;

		return (
			<Marker tracksViewChanges={tracksViewChanges} coordinate={coordinate} onPress={onPress}>
				<View style={{ ...styles.outerCircle, backgroundColor: getColorByTreeStatus(status) }}>
					<View style={styles.innerCircle} />
				</View>
			</Marker>
		);
	}
}

const styles = StyleSheet.create({
	outerCircle: {
		backgroundColor: '#228B22',
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
		backgroundColor: '#ffffff',
		width: 10,
		height: 10,
		borderRadius: 5,
	},
});
