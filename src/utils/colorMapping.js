import * as colors from '../styles/colors';

export const getColorByTreeStatus = (status) =>
	({
		healthy: colors.green,
		adequate: colors.linkBlue,
		average: colors.yellow,
		weak: colors.orange,
		almostDead: colors.red,
	}[status]);
