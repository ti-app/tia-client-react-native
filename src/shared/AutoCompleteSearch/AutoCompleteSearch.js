import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Icon } from 'native-base';
import styles from './AutoCompleteSearch.styles';
import FormInput from '../FormInput/FormInput';
import globalStyles from '../../styles/global';

const ResultRow = ({ value, onPress, isLast }) => {
	return (
		<TouchableOpacity
			style={[styles.resultRow, isLast ? null : styles.resultRowBottomBorder]}
			onPress={onPress}
		>
			<Text style={styles.resultRowText}>{value}</Text>
		</TouchableOpacity>
	);
};

const SearchPlaces = ({ onSearch, results, onResultPress, onClose }) => {
	return (
		<View style={styles.autoCompleteSearchContainer}>
			<View style={styles.searchContainer}>
				<FormInput
					icon={<Icon type="AntDesign" style={globalStyles.inputIcon} name="search1" />}
					placeholder="Search places..."
					keyboardType="default"
					onChangeText={onSearch}
					secondaryIcon={
						<Icon
							type="Entypo"
							style={[styles.searchActionIcon, globalStyles.inputIcon]}
							name="cross"
						/>
					}
					secondaryIconPress={onClose}
					style={styles.searchInput}
				/>
			</View>
			{results && results.length ? (
				<View style={styles.resultsContainer}>
					<View style={styles.results}>
						{results.map((aResult, idx) => (
							<ResultRow
								key={idx}
								value={aResult.description}
								onPress={() => {
									onResultPress(aResult);
								}}
								isLast={idx === results.length - 1}
							/>
						))}
					</View>
				</View>
			) : null}
		</View>
	);
};

export default SearchPlaces;
