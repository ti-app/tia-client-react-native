import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Slider } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import { toggleFilter } from '../../store/actions/ui-interactions.action';
import SelectTreeHealth from '../shared/SelectTreeHealth';
import OptionsBar from '../Navigation/OptionsBar';

class FilterTree extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			distance: 2,
			selectedStatus: {},
		};
	}

	render() {
		const { distance, selectedStatus } = this.state;
		const { onFilterChanged, toggleFilter } = this.props;

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
							console.log('Save filter option and do something with it');
						},
					}}
				/>
				<Content style={styles.content}>
					<Text style={styles.textStyle}>How far from you?</Text>
					<View style={styles.view}>
						<Slider
							style={styles.slider}
							step={1}
							minimumValue={1}
							maximumValue={5}
							value={distance}
							onValueChange={(val) => {
								this.setState({ distance: val });
								onFilterChanged({ distance, selectedStatus });
							}}
							thumbTintColor="rgb(252, 228, 149)"
							maximumTrackTintColor="#000"
							minimumTrackTintColor="#2f2f2f"
						/>
					</View>
					<View style={styles.currentDistanceView}>
						<Text style={styles.currentDistance}>{`${distance}km`}</Text>
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
							onFilterChanged({ distance, selectedStatus });
						}}
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
	currentDistanceView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	currentDistance: {
		color: '#000',
	},
});
