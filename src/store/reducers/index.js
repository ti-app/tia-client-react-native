import { combineReducers } from 'redux';
import uiInteractionsReducer from './ui-interactions.reducer';
import locationReducer from './location.reducer';
import authReducer from './auth.reducer';
import treeReducer from './tree.reducer';
import plantationSiteReducer from './plantation-site.reducer';
import activityReducer from './activity.reducer';
import leaderBoardReducer from './leaderboard.reducer';
import panicReducer from './panic.reducer';

// Root Reducer
const rootReducer = combineReducers({
	ui: uiInteractionsReducer,
	location: locationReducer,
	leaderboard: leaderBoardReducer,
	auth: authReducer,
	tree: treeReducer,
	plantationSite: plantationSiteReducer,
	activity: activityReducer,
	panic: panicReducer,
});

export default rootReducer;
