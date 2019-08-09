export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const SET_LOADING = 'SET_LOADING';

export const toggleFilter = () => ({
	type: TOGGLE_FILTER,
});

export const setLoading = (flag) => ({
	type: SET_LOADING,
	flag,
});
