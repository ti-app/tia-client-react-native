import React, { useCallback } from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './PanicListScreen.style';
import { View, Text, Button, Icon } from 'native-base';

import { selectPanic } from '../../store/reducers/panic.reducer';
import * as panicActions from '../../store/actions/panic.action';
import config from '../../config/common';
import { selectUserRole } from '../../store/reducers/auth.reducer';

const Panic = ({ navigation }) => {
	const userRole = useSelector(selectUserRole);
	const panicData = useSelector(selectPanic);

	const dispatch = useDispatch();
	const resolvePanic = useCallback((panicId) => dispatch(panicActions.resolvePanic(panicId)), [
		dispatch,
	]);

	const renderPanicRow = ({ item, index }) => {
		const { photo, googlePlaceName, owner, panicType, location, _id } = item;

		const { coordinates } = location;

		const [longitude, latitude] = coordinates;

		const onGoToLocationPress = () => {
			const homeMapRef = navigation.getParam('homeMapRef', null);

			const mapLocation = {
				latitude,
				longitude,
				latitudeDelta: 0.000882007226706992,
				longitudeDelta: 0.000752057826519012,
			};
			if (homeMapRef) {
				homeMapRef.animateToRegion(mapLocation, 2000);
			}
			navigation.navigate('Home');
		};

		const onResolvePress = async () => {
			await resolvePanic(_id);
			navigation.navigate('Home');
		};

		return (
			<View style={styles.panicRow}>
				{photo ? (
					<View style={styles.displayPhotoContainer}>
						<Image
							source={{
								uri: photo,
							}}
							resizeMode="contain"
							style={styles.displayPhoto}
						/>
					</View>
				) : (
					<Icon type="FontAwesome5" style={styles.defaultUserIcon} name="user-circle" />
				)}
				<View style={styles.detailsContainer}>
					<View style={styles.location}>
						<Text>Location: {googlePlaceName}</Text>
					</View>
					<View style={styles.addedByPanicType}>
						<View style={styles.addedBy}>
							{
								<Text style={styles.addedByText}>
									Panic raised by: {owner.displayName || 'Unknown'}
								</Text>
							}
						</View>
						<View style={styles.panicType}>
							<Text style={styles.panitTypeText}>Panic type: {panicType.toUpperCase()}</Text>
						</View>
					</View>
					<View style={styles.actionButtonContainer}>
						<Button
							style={{
								...styles.actionButton,
							}}
							onPress={onGoToLocationPress}
						>
							<Text style={styles.actionButtonText}>GO TO LOCATION</Text>
						</Button>
						{userRole === config.roles.MODERATOR && (
							<Button
								style={{
									...styles.actionButton,
								}}
								success
								onPress={onResolvePress}
							>
								<Text style={styles.actionButtonText}>RESOLVE</Text>
							</Button>
						)}
					</View>
				</View>
			</View>
		);
	};

	if (!panicData || !panicData.length) {
		return (
			<View style={styles.fallbackContainer}>
				<Text>There are no panic nearby at the moment.</Text>
			</View>
		);
	}

	return (
		<View style={styles.panicListContainer}>
			<FlatList
				style={styles.listview}
				data={panicData}
				extraData={panicData}
				renderItem={renderPanicRow}
				keyExtractor={(_, index) => index + ''}
			/>
		</View>
	);
};

Panic.navigationOptions = () => {
	return { headerTitle: 'Panic' };
};

export default Panic;
