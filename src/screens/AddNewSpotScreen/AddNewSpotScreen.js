import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { SafeAreaView, View, Animated, Easing, TouchableOpacity, Platform } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Step1SetTreeDistribution from './SetTreeDistribution';
import Step2SetTreeLocations from './SetTreeLocations';
import Step3SetTreeDetails from './SetTreeDetails';
import Step4SetPhoto from './SetPhoto';

import OptionsBar from '../../components/Navigation/OptionsBar';

import * as colors from '../../styles/colors';
import { addGroup } from '../../store/actions/tree.action';
import constants from '../../config/common';

const { distributions } = constants;

const SlideFromRight = (index, position, width) => {
	const inputRange = [index - 1, index, index + 1];
	const translateX = position.interpolate({
		inputRange,
		outputRange: [width, 0, 0],
	});
	const slideFromRight = { transform: [{ translateX }] };
	return slideFromRight;
};

const TransitionConfiguration = () => {
	return {
		transitionSpec: {
			duration: 300,
			easing: Easing.out(Easing.poly(1)),
			timing: Animated.timing,
			useNativeDriver: true,
		},
		screenInterpolator: (sceneProps) => {
			const { layout, position, scene } = sceneProps;
			const width = layout.initWidth;
			const { index, route } = scene;
			const params = route.params || {}; // <- That's new
			const transition = params.transition || 'default'; // <- That's new
			return {
				default: SlideFromRight(index, position, width),
			}[transition];
		},
	};
};

const Controller = ({ onBack, onNext, onDone }) => {
	return (
		<SafeAreaView style={styles.safeAreaView}>
			{onBack && (
				<TouchableOpacity style={styles.backButton} onPress={onBack}>
					<AntDesign name="arrowleft" color={colors.black.toString()} size={32} />
				</TouchableOpacity>
			)}
			{onNext && (
				<TouchableOpacity style={styles.nextButton} onPress={onNext}>
					<AntDesign name="arrowright" color={colors.black.toString()} size={32} />
				</TouchableOpacity>
			)}
			{onDone && (
				<TouchableOpacity onPress={onDone}>
					<AntDesign name="check" color={colors.green.toString()} size={32} />
				</TouchableOpacity>
			)}
		</SafeAreaView>
	);
};

const addSpotSteps = {
	selectDistribution: 'SelectDistribution',
	addTrees: 'AddTrees',
	treeDetails: 'TreeDetails',
	treePhoto: 'TreePhoto',
};

const SNavigator = createStackNavigator(
	{
		[addSpotSteps.selectDistribution]: {
			screen: Step1SetTreeDistribution,
		},
		[addSpotSteps.addTrees]: {
			screen: Step2SetTreeLocations,
		},
		[addSpotSteps.treeDetails]: {
			screen: Step3SetTreeDetails,
		},
		[addSpotSteps.treePhoto]: {
			screen: Step4SetPhoto,
		},
	},
	{
		headerMode: 'none',
		initialRouteName: addSpotSteps.selectDistribution,
		transitionConfig: TransitionConfiguration,
	}
);

class AddNewSpotScreen extends React.Component {
	static router = SNavigator.router;

	constructor(props) {
		super(props);
		this.stepsArray = Object.keys(addSpotSteps).map((k) => addSpotSteps[k]);
		this.state = {
			currentStep: 0,
		};
	}

	static navigationOptions = ({ navigation }) => {
		const header = {
			headerTitle: (
				<OptionsBar
					title="Add a spot"
					leftOption={{
						label: 'Cancel',
						action: () => navigation.navigate('Home'),
					}}
				/>
			),
			headerTransparent: true,
			headerStyle: {
				height: 80,
				backgroundColor: '#ffff',
				opacity: 0.8,
			},
			headerLeft: null,
		};

		return header;
	};

	handleOnBack = () => {
		const { navigation } = this.props;
		this.setState(
			(prevState) => ({
				...prevState,
				currentStep: prevState.currentStep - 1,
			}),
			() => {
				navigation.pop();
			}
		);
	};

	handleOnNext = () => {
		const { currentStep } = this.state;
		const { navigation, newTreeGroup } = this.props;
		const { distribution } = newTreeGroup;

		let nextStep;
		// If distribution is single skip the add tree detail page
		if (distribution === distributions.SINGLE && currentStep === 0) {
			nextStep = currentStep + 2;
		} else {
			nextStep = currentStep + 1;
		}

		this.setState(
			{
				currentStep: nextStep,
			},
			() => {
				navigation.navigate(this.stepsArray[nextStep]);
			}
		);
	};

	handleOnDone = () => {
		const { newTreeGroup, addGroup } = this.props;
		const { distribution, trees, health, plantType, waterCycle, photo } = newTreeGroup;

		const formData = this.createFormData(photo, {
			distribution,
			trees: JSON.stringify(
				trees.map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude }))
			),
			health,
			plantType,
			waterCycle,
		});

		addGroup(formData);
	};

	createFormData = (uri, body) => {
		const data = new FormData();
		if (uri) {
			const filename = uri.split('/').pop();
			const type = filename.split('.').pop();

			data.append('photo', {
				uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
				type: `image/${type}`,
				name: filename,
			});
		}

		Object.keys(body).forEach((key) => {
			data.append(key, body[key]);
		});

		return data;
	};

	render() {
		const maxSteps = 4;
		const { currentStep } = this.state;
		const { navigation } = this.props;
		return (
			<View style={{ flex: 1 }}>
				<SNavigator navigation={navigation} />
				<Controller
					onNext={currentStep < maxSteps - 1 ? this.handleOnNext : null}
					onBack={currentStep !== 0 ? this.handleOnBack : null}
					onDone={currentStep === maxSteps - 1 ? this.handleOnDone : null}
				/>
			</View>
		);
	}
}

const styles = {
	container: {
		backgroundColor: colors.white,
		flex: 1,
		width: '100%',
	},
	safeAreaView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: colors.white,
		borderColor: colors.lightGray,
		borderTopWidth: 1,
		paddingHorizontal: 4,
		paddingTop: 4,
		paddingBottom: 4,
	},
	touchableHighlight: {
		alignItems: 'center',
		backgroundColor: colors.white,
		justifyContent: 'center',
		margin: 15,
		padding: 15,
		width: '100%',
	},
	backButton: {
		marginRight: 'auto',
	},
	nextButton: {},
};

const mapStateToProps = (state) => ({
	newTreeGroup: state.tree.newTreeGroup,
});

const mapDispatchToProps = (dispatch) => ({
	addGroup: (...params) => dispatch(addGroup(...params)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddNewSpotScreen);
