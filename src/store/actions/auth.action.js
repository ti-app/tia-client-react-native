export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS';
export const UPDATE_USER_ROLE = 'UPDATE_USER_ROLE';

export const updateUserStatus = (isLoggedIn, user) => ({
	type: UPDATE_USER_STATUS,
	payload: { user, isLoggedIn },
});

export const updateUserRole = (role) => ({
	type: UPDATE_USER_ROLE,
	payload: { role },
});
