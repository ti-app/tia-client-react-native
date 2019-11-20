import { getCurrentUnixTimestamp } from '../../utils/date-time';
import config from '../../config/common';

import {
	ADD_TREE_GROUP,
	ADD_TREE_GROUP_COMMIT,
	ADD_TREE_GROUP_ROLLBACK,
	FETCH_TREE_GROUP_SUCCESS,
	SET_SELECTED_TREE_DETAILS,
	SET_SELECTED_TREE_GROUP,
	RESET_SELECTED_TREE_GROUP,
	SET_NEW_TREE_GROUP,
	RESET_NEW_TREE_GROUP,
} from '../actions/tree.action';

const initialState = {
	treeGroups: [],
	notCommitedTreeGroups: [],
	selectedTree: null,
	selectedTreeGroup: null,
	newTreeGroup: {
		distribution: 'single',
		trees: [],
		health: null,
		plantType: '',
		waterCycle: 0,
		photo: '',
	},
};

const omitForTempUuid = (_state, _tempUuid) => {
	return _state.notCommitedTreeGroups.filter(({ tempUuid, commited }) => {
		if (tempUuid === _tempUuid) {
			return false;
		}

		return true;
	});
};

/**
 * Makes tree group object as we get in treeGroup array from treegroup formdata and tempUuid
 */
const makeTreeGroupFromFD = (treeGroupFD, tempUuid, user, role) => {
	const { displayName, uid: userUid } = user;
	const treeGroupJson = {};

	const treeGroupKeyValue = treeGroupFD._parts;

	treeGroupKeyValue.forEach(([key, value]) => {
		if (!treeGroupJson.hasOwnProperty(key)) {
			treeGroupJson[key] = value;
			return;
		}
		if (!Array.isArray(treeGroupJson[key])) {
			treeGroupJson[key] = [treeGroupJson[key]];
		}
		treeGroupJson[key].push(value);
	});

	console.log(treeGroupJson);

	const { trees: stringifiedTrees, health, plantType, waterCycle } = treeGroupJson;

	const trees = JSON.parse(stringifiedTrees);

	const treeGroup = {
		tempUuid,
		photo: '',
		photoName: '',
		health,
		healthCycle: waterCycle,
		createdAt: getCurrentUnixTimestamp(),
		createdBy: userUid,
		lastActivityDate: getCurrentUnixTimestamp(),
		lastActedUser: userUid,
		lastActivityType: 'TREE_ADDED',
		owner: {
			userId: userUid,
			displayName,
		},
		location: {
			type: 'Point',
			coordinates: [trees[0].lng, trees[0].lat],
		},
		moderatorApproved: config.roles.MODERATOR === role,
		committed: false,
		trees: trees.map(({ lng, lat }, idx) => {
			return {
				tempUuid: `${tempUuid}-${idx}`,
				photo: '',
				photoName: '',
				health,
				healthCycle: waterCycle,
				createdAt: getCurrentUnixTimestamp(),
				createdBy: userUid,
				lastActivityDate: getCurrentUnixTimestamp(),
				lastActedUser: userUid,
				lastActivityType: 'TREE_ADDED',
				owner: {
					userId: userUid,
					displayName,
				},
				groupTempUuid: tempUuid,
				location: {
					type: 'Point',
					coordinates: [lng, lat],
				},
				committed: false,
			};
		}),
	};

	return treeGroup;
};

const treeReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_TREE_GROUP_SUCCESS: {
			return { ...state, treeGroups: action.payload };
		}

		case ADD_TREE_GROUP: {
			const { treeGroup, tempUuid, user, role } = action.payload;
			return {
				...state,
				notCommitedTreeGroups: [
					...state.notCommitedTreeGroups,
					makeTreeGroupFromFD(treeGroup, tempUuid, user, role),
				],
			};
		}

		case ADD_TREE_GROUP_COMMIT: {
			return { ...state, notCommitedTreeGroups: omitForTempUuid(state, action.meta.tempUuid) };
		}

		case ADD_TREE_GROUP_ROLLBACK: {
			return { ...state, notCommitedTreeGroups: omitForTempUuid(state, action.meta.tempUuid) };
		}

		case SET_SELECTED_TREE_DETAILS: {
			return {
				...state,
				selectedTree: { ...action.payload },
			};
		}

		case SET_SELECTED_TREE_GROUP: {
			return {
				...state,
				selectedTreeGroup: { ...action.payload },
			};
		}

		case RESET_SELECTED_TREE_GROUP: {
			return {
				...state,
				selectedTreeGroup: null,
			};
		}

		case SET_NEW_TREE_GROUP: {
			return {
				...state,
				newTreeGroup: { ...state.newTreeGroup, ...action.payload },
			};
		}

		case RESET_NEW_TREE_GROUP: {
			return {
				...state,
				newTreeGroup: {
					distribution: 'single',
					trees: [],
					health: null,
					plantType: '',
					waterCycle: 0,
					photo: '',
				},
			};
		}

		default: {
			return state;
		}
	}
};

export default treeReducer;

export const selectTreeGroups = (state) => [
	...state.tree.treeGroups,
	...state.tree.notCommitedTreeGroups,
];
export const selectSelectedTree = (state) => state.tree.selectedTree;
export const selectSelectedTreeGroup = (state) => state.tree.selectedTreeGroup;
export const selectNewTreeGroup = (state) => state.tree.newTreeGroup;
