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
	WATER_TREE,
	WATER_TREE_COMMIT,
	WATER_TREE_ROLLBACK,
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

/**
 * Returns list of items minus the 'item with tempUuid' from 'notCommitedTreeGroups'
 */
const omitForTempUuid = (_state, _tempUuid) => {
	return _state.notCommitedTreeGroups.filter(({ tempUuid }) => {
		if (tempUuid === _tempUuid) {
			return false;
		}

		return true;
	});
};

/**
 * Makes tree group object as we get in treeGroup array from treeGroupData
 */
const makeTreeGroupFromFD = (treeGroupData, tempUuid, user, role) => {
	const { displayName, uid: userUid } = user;

	const { trees, health, plantType, waterCycle } = treeGroupData;

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
			coordinates: [trees[0].longitude, trees[0].latitude],
		},
		moderatorApproved: config.roles.MODERATOR === role,
		committed: false,
		trees: trees.map(({ latitude, longitude }, idx) => {
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
					coordinates: [longitude, latitude],
				},
				committed: false,
			};
		}),
	};

	return treeGroup;
};

/**
 * Returns updated list of treeGroups by merging the data for specified item with treeGroupId and treeId
 * If treeId is present tree item will be updated with the data provided
 * If treeGroupId is present treeGroup item will be updated with the data provided.
 */
const getUpdatedTreeGroups = (state, { treeGroupId: _treeGroupId, treeId: _treeId, data }) => {
	return state.treeGroups.map((_treeGroup) => {
		const { _id: treeGroupId } = _treeGroup;
		if (treeGroupId === _treeGroupId) {
			if (_treeId) {
				return {
					..._treeGroup,
					trees: _treeGroup.trees.map((tree) => {
						const { _id: treeId } = tree;
						if (treeId === _treeId) {
							return { ...tree, ...data };
						}
						return tree;
					}),
				};
			} else {
				return { ..._treeGroup, ...data };
			}
		}
		return _treeGroup;
	});
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

		case WATER_TREE: {
			const { treeGroupId, treeId } = action.payload;
			return {
				...state,
				treeGroups: getUpdatedTreeGroups(state, {
					treeGroupId,
					treeId,
					data: { health: 'healthy' },
				}),
			};
		}

		case WATER_TREE_ROLLBACK: {
			const { treeGroupId, treeId, prevHealth } = action.meta;
			return {
				...state,
				treeGroups: getUpdatedTreeGroups(state, {
					treeGroupId,
					treeId,
					data: { health: prevHealth },
				}),
			};
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
