import { UPDATE_USER_STATUS, UPDATE_USER_ROLE } from '../actions/auth.action';

const initialState = {
	user: null,
	isLoggedIn: false,
	role: null,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_USER_STATUS: {
			const { user, isLoggedIn } = action.payload;
			return { user, isLoggedIn };
		}

		case UPDATE_USER_ROLE: {
			const { role } = action.payload;
			return { ...state, role };
		}

		default: {
			return state;
		}
	}
};

export default authReducer;

export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserRole = (state) => state.auth.role;
