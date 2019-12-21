import React, { useState, useCallback, useEffect } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, Animated, Easing, TouchableOpacity } from 'react-native';
import { View, Icon } from 'native-base';

import Step1SetTreeDistribution from './SetTreeDistribution';
import Step3SetTreeDetails from './SetTreeDetails';
import Step4SetPhoto from './SetPhoto';
import OptionsBar from '../../shared/NavigationBar/OptionsBar';
import * as colors from '../../styles/colors';
import * as treeActions from '../../store/actions/tree.action';
import { selectNewTreeGroup } from '../../store/reducers/tree.reducer';
import constants from '../../config/common';
import Step2SetTreeLocationsSwitch from './SetTreeLocationsSwitch';

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

const Controller = ({ onBack, onNext, onDone, disableNext, disableDone }) => {
	return (
		<SafeAreaView style={styles.safeAreaView}>
			{onBack && (
				<TouchableOpacity style={styles.backButton} onPress={onBack}>
					<Icon
						type="MaterialIcons"
						name="arrow-back"
						style={{ color: colors.black.toString() }}
						fontSize={32}
					/>
				</TouchableOpacity>
			)}
			{onNext && (
				<TouchableOpacity onPress={disableNext ? null : onNext} style={styles.nextButton}>
					<Icon
						type="MaterialIcons"
						name="arrow-forward"
						style={{
							color: disableNext ? colors.black.fade(0.8).toString() : colors.black.toString(),
							fontSize: 32,
						}}
					/>
				</TouchableOpacity>
			)}
			{onDone && (
				<TouchableOpacity onPress={disableDone ? null : onDone} style={styles.nextButton}>
					<Icon
						type="MaterialIcons"
						name="check"
						style={{
							color: disableNext ? colors.green.fade(0.8).toString() : colors.green.toString(),
							fontSize: 32,
						}}
					/>
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
			screen: Step2SetTreeLocationsSwitch,
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

const stepsArray = Object.keys(addSpotSteps).map((k) => addSpotSteps[k]);
const maxSteps = 4;

const AddNewSpotScreen = ({ navigation }) => {
	const [currentStep, setCurrentStep] = useState(0);

	const newTreeGroup = useSelector(selectNewTreeGroup);

	const dispatch = useDispatch();
	const addGroup = useCallback((...params) => dispatch(treeActions.addGroup(...params)), [
		dispatch,
	]);
	const resetNewTreeGroupData = useCallback(() => dispatch(treeActions.resetNewTreeGroupData()), [
		dispatch,
	]);

	useEffect(() => {
		navigation.setParams({
			resetNewTreeGroupData,
		});
	}, []);

	const handleOnBack = () => {
		if (currentStep === 0) {
			resetNewTreeGroupData();
		}
		setCurrentStep((_currentStep) => _currentStep - 1);
		navigation.pop();
	};

	const handleOnNext = () => {
		const { distribution } = newTreeGroup;

		let nextStep;
		// If distribution is single skip the add tree detail page
		if (distribution === distributions.SINGLE && currentStep === 0) {
			nextStep = currentStep + 2;
		} else {
			nextStep = currentStep + 1;
		}

		setCurrentStep(nextStep);
		navigation.navigate(stepsArray[nextStep]);
	};

	const handleOnDone = () => {
		addGroup();
	};

	const isNextDisabled = () => {
		const { distribution, trees, health, plantType, waterCycle } = newTreeGroup;
		switch (currentStep) {
			case 0:
				return !distribution;
			case 1:
				return !(distribution && trees && trees.length);
			case 2:
				return !(distribution && trees && trees.length && health && plantType && waterCycle);
			case 3:
				return !(distribution && trees && trees.length && health && plantType && waterCycle);
			default:
				return true;
		}
	};

	const isDoneDisabled = () => {
		const { distribution, trees, health, plantType, waterCycle } = newTreeGroup;
		return !(distribution && trees && trees.length && health && plantType && waterCycle);
	};

	return (
		<View style={styles.container}>
			<SNavigator navigation={navigation} />
			<Controller
				onNext={currentStep < maxSteps - 1 ? handleOnNext : null}
				onBack={currentStep !== 0 ? handleOnBack : null}
				onDone={currentStep === maxSteps - 1 ? handleOnDone : null}
				disableNext={isNextDisabled()}
				disableDone={isDoneDisabled()}
			/>
		</View>
	);
};

const styles = {
	container: {
		flex: 1,
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
	disabledNext: { backgroundColor: colors.black.fade(0.5) },
	disabledDone: { backgroundColor: colors.green.fade(0.5) },
	nextButton: {},
};

AddNewSpotScreen.router = SNavigator.router;
AddNewSpotScreen.navigationOptions = ({ navigation }) => {
	const header = {
		headerTitle: (
			<OptionsBar
				title="Add a spot"
				leftOption={{
					label: 'Cancel',
					action: () => {
						navigation.navigate('Home');
						const { params } = navigation.state;
						if (params && params.resetNewTreeGroupData) {
							params.resetNewTreeGroupData();
						}
					},
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

export default AddNewSpotScreen;
