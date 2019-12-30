import { StyleSheet } from 'react-native';
import * as variables from '../../styles/variables';
import * as colors from '../../styles/colors';

export default StyleSheet.create({
	panicListContainer: { flex: 1, padding: variables.space.base },
	listview: {},
	panicRow: {
		display: 'flex',
		flexDirection: 'row',
		paddingTop: variables.space.small,
		paddingBottom: variables.space.small,
		borderBottomWidth: 2,
		borderBottomColor: colors.lightGray,
	},
	displayPhotoContainer: {
		width: 60,
		height: 60,
		borderWidth: 2,
		borderRadius: 60 / 2,
		marginRight: variables.space.small,
		borderColor: colors.green.toString(),
	},
	defaultUserIcon: {
		fontSize: 60,
		marginRight: variables.space.small,
		color: colors.black.toString(),
	},
	displayPhoto: {
		width: '100%',
		height: '100%',
		borderRadius: 60 / 2,
	},
	detailsContainer: {
		flex: 1,
	},
	location: { width: '100%' },
	actionButtonContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	addedByPanicType: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' },
	addedByText: { fontSize: variables.font.base, color: colors.darkGray },
	panitTypeText: { fontSize: variables.font.base, color: colors.darkGray },
	actionButton: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
	},
	actionButtonText: { textAlign: 'center' },
});
