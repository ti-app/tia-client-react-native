import crashlytics from '@react-native-firebase/crashlytics';

/**
 *
 * @param {Error} error
 * @param {String} message
 */
const logError = (error, message) => {
	console.log(message, error);
	crashlytics().recordError(error);
};

export default { logError };
