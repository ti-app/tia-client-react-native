import { ADD_TREE_GROUP_COMMIT, dispatchFetchTreeGroupsAction } from '../actions/tree.action';

const commitMiddleware = ({ dispatch, getState }) => (next) => (action) => {
	switch (action.type) {
		case ADD_TREE_GROUP_COMMIT: {
			dispatchFetchTreeGroupsAction(dispatch, getState);
			break;
		}
	}
	return next(action);
};

export default commitMiddleware;
