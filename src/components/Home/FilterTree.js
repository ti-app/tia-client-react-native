import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Slider } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import { toggleFilter } from '../../store/actions/ui-interactions.action';
import SelectTreeHealth from '../shared/SelectTreeHealth';
import OptionsBar from '../Navigation/OptionsBar';

import * as colors from '../../styles/colors';

class FilterTree extends React.Component {
	state = {
		range: 0.5,
		selectedStatus: { healthy: true, weak: true, almostDead: true },
	};

	componentDidMount() {
		const { currentRangeFilter, currentHealthFilter } = this.props;

		if (currentRangeFilter) {
			this.setState({ range: currentRangeFilter });
		}

		if (currentHealthFilter) {
			this.setState({ selectedStatus: currentHealthFilter });
		}
	}

	render() {
		const { range, selectedStatus } = this.state;
		const { toggleFilter, onFilterChanged, currentHealthFilter, currentRangeFilter } = this.props;

		return (
			<Container style={styles.container}>
				<OptionsBar
					title="Filters"
					leftOption={{
						label: 'Cancel',
						action: () => toggleFilter(),
					}}
					rightOption={{
						label: 'Save',
						action: () => {
							onFilterChanged({ range, selectedStatus });
						},
					}}
				/>
				<Content style={styles.content}>
					<Text style={styles.textStyle}>How far from you?</Text>
					<View style={styles.view}>
						<Slider
							style={styles.slider}
							step={0.5}
							minimumValue={0.5}
							maximumValue={2.5}
							value={currentRangeFilter}
							onValueChange={(val) => {
								this.setState({ range: val });
							}}
							thumbTintColor={colors.blue}
							maximumTrackTintColor="#000"
							minimumTrackTintColor="#2f2f2f"
						/>
					</View>
					<View style={styles.currentRangeView}>
						<Text style={styles.currentRange}>{`${range}km`}</Text>
					</View>
					{/* <Text style={styles.textStyle}>How much water you can carry?</Text>
          <View style={styles.view}>
            <Button dark>
              <Text> 1-5 Lt. </Text>
            </Button>
            <Button info>
              <Text> 5-10 Lt. </Text>
            </Button>
            <Button light>
              <Text> 10-15 Lt. </Text>
            </Button>
          </View> */}
					<Text style={styles.textStyle}>Health of the plant(s)</Text>
					<SelectTreeHealth
						onSelectedStatusChange={(selectedStatus) => {
							this.setState({ selectedStatus });
						}}
						presetHealthStatus={currentHealthFilter}
						type="multiple"
					/>
				</Content>
			</Container>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	toggleFilter: () => dispatch(toggleFilter()),
});

export default connect(
	null,
	mapDispatchToProps
)(FilterTree);

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%',
		paddingTop: 10,
		zIndex: 99,
	},
	content: {
		padding: 20,
	},
	cancelButton: {
		color: '#000',
	},
	saveButton: {
		color: 'green',
	},
	view: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textStyle: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
	},
	slider: {
		padding: 10,
		width: '100%',
	},
	currentRangeView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	currentRange: {
		color: '#000',
	},
});
