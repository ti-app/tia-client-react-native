export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const TOGGLE_TREE_DETAILS = 'TOGGLE_TREE_DETAILS';
export const SET_LOADING = 'SET_LOADING';

export const toggleDrawer = () => ({
	type: TOGGLE_DRAWER,
});

export const toggleFilter = () => ({
	type: TOGGLE_FILTER,
});

export const toggleTreeDetails = () => ({
	type: TOGGLE_TREE_DETAILS,
});

export const setLoading = (flag) => ({
	type: SET_LOADING,
	flag,
});
