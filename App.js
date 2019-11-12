import React, { useState, useEffect } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StyleProvider, Root } from 'native-base';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import store from './src/store';
import AppContent from './src';
import constants from './src/config/common';
import IntroSlides from './src/utils/introSlides';

const App = () => {
	const [showIntro, setShowIntro] = useState(false);

	useEffect(() => {
		setLaunchStatus();
	}, []);

	const onIntroductionDone = async () => {
		setShowIntro(false);
		try {
			await AsyncStorage.setItem(
				constants.asyncStorage.launcStatus,
				constants.launchStatus.notInitial
			);
		} catch (error) {
			console.log('Error setting launch status', error);
		}
	};

	const setLaunchStatus = async () => {
		try {
			const value = await AsyncStorage.getItem(constants.asyncStorage.launcStatus);
			const launchStatus = value || constants.launchStatus.initial;
			setShowIntro(launchStatus === constants.launchStatus.initial);
		} catch (error) {
			console.log('Error gettings launch status', error);
			throw error;
		}
	};

	if (showIntro) {
		return <AppIntroSlider slides={IntroSlides} onDone={onIntroductionDone} />;
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
};

export default App;
