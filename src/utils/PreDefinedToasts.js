import { Toast } from 'native-base';
import * as colors from '../styles/colors';

export const showWelcomeLoginToast = () => {
	Toast.show({
		text: `Welcome! Successfully logged in`,
		buttonText: 'Okay',
		style: { backgroundColor: colors.green },
	});
};

export const showEmailSuccessfullToast = () => {
	Toast.show({
		text: `Email has been sent! `,
		buttonText: 'Okay',
		style: { backgroundColor: colors.green },
	});
};

export const showPasswordResetIssueToast = () => {
	Toast.show({
		text: `Issue while reseting password`,
		buttonText: 'Okay',
		type: 'error',
	});
};

export const showSuccessfulRegisterToast = () => {
	Toast.show({
		text: `Welcome! Successfully registerd in TIA`,
		buttonText: 'Great',
		style: { backgroundColor: colors.green },
	});
};

export const showSomethingBadToast = () => {
	Toast.show({
		text: `Something bad happened!`,
		buttonText: 'Oops',
		style: { backgroundColor: colors.red },
	});
};

export const showErrorToast = (errorMessage) => {
	Toast.show({
		text: `${errorMessage}`,
		buttonText: 'Oops',
		style: { backgroundColor: colors.red },
	});
};
