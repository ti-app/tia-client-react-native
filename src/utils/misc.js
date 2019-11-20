import config from '../config/common';
import { Platform } from 'react-native';

export const getAPIParamForHealth = (healthy, weak, almostDead) => {
	if (healthy && weak && almostDead) {
		return 'healthy,weak,almostDead';
	}
	if (healthy && almostDead) {
		return 'healthy,almostDead';
	}
	if (healthy && weak) {
		return 'healthy,weak';
	}
	if (weak && almostDead) {
		return 'weak,almostDead';
	}
	if (healthy) {
		return 'healthy';
	}
	if (weak) {
		return 'weak';
	}
	return 'almostDead';
};

export const getActivityDetails = (activity) => {
	const { iconName, iconProvider, iconColor, label } = config.activity[activity];
	return { icon: iconName, iconProvider, iconColor, title: label };
};

/**
 *
 * @param {String} uri uri for image to upload
 * @param {Object} body rest of the data to be posted
 */
export const createFormData = (body, uri) => {
	const data = new FormData();

	if (uri !== undefined && uri !== null) {
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
