import { combineReducers } from 'redux';
import uiInteractionsReducer from './ui-interactions.reducer';
import locationReducer from './location.reducer';
import authReducer from './auth.reducer';
import treeReducer from './tree.reducer';
import plantationSiteReducer from './plantation-site.reducer';
import activityReducer from './activity.reducer';

// Root Reducer
const rootReducer = combineReducers({
	ui: uiInteractionsReducer,
	location: locationReducer,
	auth: authReducer,
	tree: treeReducer,
	plantationSite: plantationSiteReducer,
	activity: activityReducer,
});

export default rootReducer;
