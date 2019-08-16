import React from 'react';
import { StyleSheet } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StyleProvider, Root } from 'native-base';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import store from './src/store';
import AppContent from './src';
import loadResourcesAsync from './src/utils/LoadResources';
import * as colors from './src/styles/colors';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showIntroduction: false,
		};
	}

	async componentWillMount() {
		const launchStatus = await this.getLaunchStatus();
		this.setState({ showIntroduction: launchStatus === 'INITIAL' });
	}

	componentDidMount() {
		loadResourcesAsync();
	}

	onIntroductionDone = async () => {
		this.setState({ showIntroduction: false });
		try {
			await AsyncStorage.setItem('LAUNCH_STATUS', 'NOT_INITIAL');
		} catch (error) {
			console.log('Error setting launch status', error);
		}
	};

	getLaunchStatus = async () => {
		try {
			const value = await AsyncStorage.getItem('LAUNCH_STATUS');
			return value || 'INITIAL';
		} catch (error) {
			console.log('Error gettings launch status', error);
			throw error;
		}
	};

	render() {
		const { showIntroduction } = this.state;
		if (showIntroduction) {
			return <AppIntroSlider slides={slides} onDone={this.onIntroductionDone} />;
		}

		return (
			<Root>
				<Provider store={store}>
					<StyleProvider style={getTheme(material)}>
						<AppContent />
					</StyleProvider>
				</Provider>
			</Root>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},

	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.5,
		backgroundColor: 'black',
		zIndex: 99,
	},
});

/* eslint-disable */
const slides = [
	{
		key: 'intro_1',
		title: 'Title 1',
		text: 'Description.\nSay something cool',
		image: require('./assets/images/tia_intro_1.png'),
		imageStyle: styles.introImage,
		backgroundColor: colors.green,
	},
	{
		key: 'intro_2',
		title: 'Title 2',
		text: 'Other cool stuff',
		image: require('./assets/images/tia_intro_1.png'),
		imageStyle: styles.introImage,
		backgroundColor: colors.yellow,
	},
	{
		key: 'intro_3',
		title: 'Rocket guy',
		text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
		image: require('./assets/images/tia_intro_1.png'),
		imageStyle: styles.introImage,
		backgroundColor: colors.orange,
	},
];
/* eslint-enable */
