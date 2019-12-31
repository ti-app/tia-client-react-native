import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import apiClient from '../utils/apiClient';
import { createFormData } from '../utils/misc';
import { getFirebaseToken, isFirebaseInitialized } from '../utils/firebase';
import rootReducer from './reducers';
import { commitMiddleware } from './middlewares';

const effect = (_effect, _action) => {
	const { headers, data } = _effect;

	if (headers && headers['content-type'] === 'multipart/form-data') {
		// INFO: redux-offline stores JSON.strinigfied data in asyncstorage.
		// In case of formdata, it doesn't rehydrate the same way it was before persiting in asyncstorage.
		// That is why we will check 'content-type' header to 'multipart/form-data'
		// Using this json we will create form data
		// Two Assumtions: 'data' should be json and if contains image uri, it should be in 'photo' field.
		let photoUri;

		if (data.photo) {
			photoUri = data.photo;
			delete data.photo;
		}

		const formData = createFormData(data, photoUri);

		_effect.data = formData;
	}

	return apiClient(_effect);
};

const discard = async (_error, _action, _retries) => {
	const { request, response } = _error;
	if (!request) {
		throw _error;
	}
	if (!response) {
		return false;
	}

	if (response.status === 401) {
		if (!isFirebaseInitialized()) {
			return false;
		}
		// FIXME: This could have consequences. Validate and refactor if needed.
		if (_retries <= 2) {
			return false;
		}
		const newAccessToken = await getFirebaseToken();
		if (newAccessToken !== undefined && newAccessToken !== null) {
			return false;
		} else {
			return true;
		}
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
