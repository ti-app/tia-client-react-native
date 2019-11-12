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
	},
	launchStatus: {
		initial: 'INITIAL',
		notInitial: 'NOT_INITIAL',
	},
	asyncStorage: {
		launcStatus: 'LAUNCH_STATUS',
	},
	activity: {
		TREE_WATERED: 'TREE_WATERED',
		TREE_ADDED: 'TREE_ADDED',
	},
	icons: {
		treeWatered: { name: 'water', provider: 'Ionicons', color: colors.black.toString() },
		treeAdded: { name: 'tree', provider: 'Entypo', color: colors.black.toString() },
	},
};
