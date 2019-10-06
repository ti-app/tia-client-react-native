import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { SafeAreaView, View, Animated, Easing, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OptionsBar from '../components/Navigation/OptionsBar';

import * as colors from '../styles/colors';

const styles = {
	container: {
		backgroundColor: '#ffffff',
		flex: 1,
		width: '100%',
	},
	safeAreaView: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderColor: colors.lightGray,
		borderTopWidth: 1,
		paddingHorizontal: 4,
		paddingTop: 4,
		paddingBottom: 4,
	},
	touchableHighlight: {
		alignItems: 'center',
		backgroundColor: '#e6e7e8',
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

const SlideFromRight = (index, position, width) => {
	const inputRange = [index - 1, index, index + 1];
	const translateX = position.interpolate({
		inputRange: [index - 1, index, index + 1],
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

const Controller = ({ onBack, onNext }) => {
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
		</SafeAreaView>
	);
};

const AView = () => (
	<View
		style={{
			backgroundColor: colors.orange,
			flex: 1,
		}}
	>
		<Text>AView</Text>
	</View>
);

const BView = () => (
	<View
		style={{
			backgroundColor: colors.green,
			flex: 1,
		}}
	>
		<Text>BView</Text>
	</View>
);

const CView = () => (
	<View
		style={{
			backgroundColor: colors.purple,
			flex: 1,
		}}
	>
		<Text>CView</Text>
	</View>
);

const DView = () => (
	<View
		style={{
			backgroundColor: colors.blue,
			flex: 1,
		}}
	>
		<Text>DView</Text>
	</View>
);

const addSpotSteps = {
	selectDistribution: 'SelectDistribution',
	addTrees: 'AddTrees',
	treeDetails: 'TreeDetails',
	treePhoto: 'TreePhoto',
};

const SNavigator = createStackNavigator(
	{
		[addSpotSteps.selectDistribution]: {
			screen: AView,
		},
		[addSpotSteps.addTrees]: {
			screen: BView,
		},
		[addSpotSteps.treeDetails]: {
			screen: CView,
		},
		[addSpotSteps.treePhoto]: {
			screen: DView,
		},
	},
	{
		headerMode: 'none',
		initialRouteName: addSpotSteps.selectDistribution,
		transitionConfig: TransitionConfiguration,
	}
);

class StepperForm extends React.Component {
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
			(prevState) => {
				return {
					...prevState,
					currentStep: prevState.currentStep - 1,
				};
			},
			() => {
				navigation.pop();
			}
		);
	};

	handleOnNext = () => {
		const { currentStep } = this.state;
		const { navigation } = this.props;
		this.setState(
			(prevState) => {
				return {
					...prevState,
					currentStep: prevState.currentStep + 1,
				};
			},
			() => {
				navigation.navigate(this.stepsArray[currentStep + 1]);
			}
		);
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
				/>
			</View>
		);
	}
}

export default StepperForm;
