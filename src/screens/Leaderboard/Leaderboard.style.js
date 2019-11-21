import { StyleSheet } from 'react-native';
import * as variables from '../../styles/variables';
import * as colors from '../../styles/colors';

export default StyleSheet.create({
	leaderboard: { flex: 1, padding: variables.space.base },
	firstRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
	rankNumber: { color: colors.orange.toString() },
	totalActivities: { display: 'flex', flexDirection: 'row' },
	totalActivitiesHeading: { fontSize: variables.font.base },
	totalActivitiesValue: { fontSize: variables.font.base },
	displayPhotoContainer: {
		width: 60,
		height: 60,
		borderWidth: 2,
		borderRadius: 60 / 2,
		borderColor: colors.green.toString(),
	},
	displayPhoto: {
		width: '100%',
		height: '100%',
		borderRadius: 60 / 2,
	},
	defaultUserIcon: {
		fontSize: 60,
		color: colors.black.toString(),
	},
	topUser: {
		flex: 0.8,
		height: 240,
		marginRight: variables.space.small,
		padding: variables.space.base,
		borderRadius: variables.space.large,
		backgroundColor: colors.lightGray.toString(),
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	secondThirdTopUserContainer: {
		flex: 1,
		marginLeft: variables.space.small,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	secondThirdUserCard: {
		height: 110,
		padding: variables.space.base,
		borderRadius: variables.space.large,
		backgroundColor: colors.lightGray.toString(),
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	displayName: { color: colors.black.toString() },
	normalUserRow: {
		width: '100%',
		height: 70,
		borderRadius: variables.space.large,
		backgroundColor: colors.lightGray.toString(),
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: variables.space.small,
	},
	fallbackContainer: {
		flex: 1,
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
});