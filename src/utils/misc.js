import config from '../config/common';
import * as colors from '../styles/colors';

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
