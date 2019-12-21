import * as colors from '../styles/colors';

export default {
	api: {
		base: 'https://tia-server.herokuapp.com/v1',
	},
	roles: {
		MODERATOR: 'moderator',
	},
	distributions: {
		SINGLE: 'single',
		LINE: 'line',
		RANDOM: 'random',
	},
	launchStatus: {
		initial: 'INITIAL',
		notInitial: 'NOT_INITIAL',
	},
	asyncStorage: {
		launcStatus: 'LAUNCH_STATUS',
	},
	activity: {
		TREE_WATERED: {
			iconName: 'water',
			iconProvider: 'Ionicons',
			iconColor: colors.black.toString(),
			label: 'Watered a plant',
		},
		TREE_ADDED: {
			iconName: 'tree',
			iconProvider: 'Entypo',
			iconColor: colors.black.toString(),
			label: 'Added a plant',
		},
		TREE_DELETED: {
			iconName: 'delete',
			iconProvider: 'AntDesign',
			iconColor: colors.black.toString(),
			label: 'Deleted a plant',
		},
		TREE_UPDATED: {
			iconName: 'update',
			iconProvider: 'MaterialIcons',
			iconColor: colors.black.toString(),
			label: 'Updated a plant',
		},
		TREE_FERTILIZED: {
			iconName: 'toolbox',
			iconProvider: 'MaterialCommunityIcons',
			iconColor: colors.black.toString(),
			label: 'Fertilized a plant',
		},
		SITE_ADDED: {
			iconName: 'check-box-outline-blank',
			iconProvider: 'MaterialIcons',
			iconColor: colors.black.toString(),
			label: 'Added a site',
		},
		SITE_DELETED: {
			iconName: 'delete',
			iconProvider: 'AntDesign',
			iconColor: colors.black.toString(),
			label: 'Deleted a site',
		},
		SITE_UPDATED: {
			iconName: 'update',
			iconProvider: 'MaterialIcons',
			iconColor: colors.black.toString(),
			label: 'Updated a site',
		},
	},
	maxProximityDistance: 50, // in meters
	notificationAppState: {
		foreground: 'FOREGROUND',
		background: 'BACKGROUND',
		killed: 'KILLED',
		// dataOnly: 'DATA_ONLY',
	},
};
