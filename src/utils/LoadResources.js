import * as Font from 'expo-font';

const loadResourcesAsync = async () => {
	return Promise.all([
		Font.loadAsync({
			// We include SpaceMono because we use it in HomeScreen.js. Feel free
			// to remove this if you are not using it in your app
			'product-sans': require('../../assets/fonts/ProductSans-Regular.ttf'),
			'font-awesome': require('../../assets/fonts/FontAwesome.ttf'),
			Roboto: require('../../node_modules/native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('../../node_modules/native-base/Fonts/Roboto_medium.ttf'),
		}),
	]);
};

export default loadResourcesAsync;
