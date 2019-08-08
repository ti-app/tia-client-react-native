import * as colors from '../styles/colors';

// eslint-disable-next-line import/prefer-default-export
export const getColorByTreeStatus = (status) =>
	({
		healthy: colors.green,
		weak: colors.orange,
		almostDead: colors.red,
	}[status]);
