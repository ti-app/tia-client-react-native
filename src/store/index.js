import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import apiClient from '../utils/apiClient';
import rootReducer from './reducers';
import { commitMiddleware } from './middlewares';

const effect = (_effect, _action) => apiClient(_effect);
const discard = (_error, _action, _retries) => {
	const { request, response } = _error;
	if (!request) {
		throw _error;
	}
	if (!response) {
		return false;
	}
	return response.status >= 400 && response.status < 500;
};

const configureStore = (initialState) => {
	const middleware = applyMiddleware(commitMiddleware, thunk);

	return createStore(
		rootReducer,
		initialState,
		composeWithDevTools(offline({ ...offlineConfig, effect, discard }), middleware)
	);
};

const store = configureStore({});

export default store;
