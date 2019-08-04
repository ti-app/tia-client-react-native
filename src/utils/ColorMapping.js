import variables from '../../native-base-theme/variables/material';

// eslint-disable-next-line import/prefer-default-export
export const getColorByTreeStatus = (status) =>
	({
		healthy: variables.brandSuccess,
		weak: variables.brandWarning,
		almostDead: variables.brandDanger,
	}[status]);
