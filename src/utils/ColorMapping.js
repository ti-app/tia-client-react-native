import * as colors from '../styles/colors';

// eslint-disable-next-line import/prefer-default-export
export const getColorByTreeStatus = (status) =>
	({
		healthy: colors.green,
		adequate: colors.linkBlue,
		average: colors.yellow,
		weak: colors.orange,
		almostDead: colors.red,
	}[status]);
