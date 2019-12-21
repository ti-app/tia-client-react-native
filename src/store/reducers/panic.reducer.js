import { FETCH_PANIC_SUCCESS } from '../actions/panic.action';

const initialState = {
	panics: [],
};

const panicReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_PANIC_SUCCESS: {
			return { panics: action.payload };
		}

		default: {
			return state;
		}
	}
};

export default panicReducer;

export const selectPanic = (state) => state.panic.panics;
