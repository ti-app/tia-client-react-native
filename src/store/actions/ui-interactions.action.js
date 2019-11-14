export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const SET_LOADING = 'SET_LOADING';
export const SET_CURRENT_STATUS_LIST = 'SET_CURRENT_STATUS_LIST';
export const SET_CURRENT_RANGE_FILTER = 'SET_CURRENT_RANGE_FILTER';

export const toggleFilter = () => ({
	type: TOGGLE_FILTER,
});

export const setLoading = (flag) => ({
	type: SET_LOADING,
	flag,
});

export const setCurrentStatusList = (data) => ({
	type: SET_CURRENT_STATUS_LIST,
	payload: data,
});

export const setCurrentRangeFilter = (range) => ({
	type: SET_CURRENT_RANGE_FILTER,
	payload: range,
});
