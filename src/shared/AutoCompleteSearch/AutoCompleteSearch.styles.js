import { StyleSheet } from 'react-native';
import * as variables from '../../styles/variables';
import * as colors from '../../styles/colors';

const styles = StyleSheet.create({
	autoCompleteSearchContainer: {
		width: '100%',
	},
	searchContainer: {},
	searchInputBorder: { borderColor: colors.green.toString(), borderWidth: 1 },
	resultsContainer: {},
	results: {
		width: '100%',
		backgroundColor: colors.white.toString(),
		borderColor: colors.green.toString(),
		borderWidth: 1,
	},
	resultRow: {
		width: '100%',
		backgroundColor: colors.lightGray.toString(),
		padding: variables.space.xs,
	},
	resultRowBottomBorder: {
		borderBottomColor: colors.gray.toString(),
		borderBottomWidth: 1,
	},
	resultRowText: {
		color: colors.darkGray.toString(),
	},
});

export default styles;
