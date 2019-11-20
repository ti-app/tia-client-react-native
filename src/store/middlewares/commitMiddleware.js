import { ADD_TREE_GROUP_COMMIT, fetchTreeGroups } from '../actions/tree.action';

const commitMiddleware = ({ dispatch, getState }) => (next) => (action) => {
	switch (action.type) {
		case ADD_TREE_GROUP_COMMIT: {
			const state = getState();
			const {
				location: { homeMapCenter },
				ui: { currentStatusList, currentRangeFilter },
			} = state;

			dispatch(
				fetchTreeGroups(
					{
						...homeMapCenter,
					},
					currentRangeFilter * 1000,
					currentStatusList.join(',')
				)
			);
			break;
		}
	}
	return next(action);
};

export default commitMiddleware;
