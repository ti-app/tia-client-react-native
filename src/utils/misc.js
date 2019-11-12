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
	let icon, iconProvider, iconColor, title;

	switch (activity) {
		case config.activity.TREE_WATERED: {
			icon = config.icons.treeWatered.name;
			iconProvider = config.icons.treeWatered.provider;
			iconColor = config.icons.treeWatered.color;
			title = 'Watered a plant';
			break;
		}
		case config.activity.TREE_ADDED: {
			icon = config.icons.treeAdded.name;
			iconProvider = config.icons.treeAdded.provider;
			iconColor = config.icons.treeAdded.color;
			title = 'Added a plant';
			break;
		}
		default: {
			icon = 'question';
			iconProvider = 'AntDesign';
			iconColor = colors.black.toString();
		}
	}
	return { icon, iconProvider, iconColor, title };
};
