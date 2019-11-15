import React, { useEffect, useCallback } from 'react';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Leaderboard.style';
import { View, Text, Icon } from 'native-base';

import * as variables from '../../styles/variables';
import { selectLeaderboard } from '../../store/reducers/leaderboard.reducer';
import * as leaderboardActions from '../../store/actions/leaderboard.action';

const renderDisplayPhoto = (photoUri) => {
	if (!photoUri) {
		return <Icon type="FontAwesome5" style={[styles.defaultUserIcon]} name="user-circle" />;
	}
	return (
		<View style={styles.displayPhotoContainer}>
			<Image
				source={{
					uri: photoUri,
				}}
				resizeMode="contain"
				style={styles.displayPhoto}
			/>
		</View>
	);
};

const renderTotalActivities = (activityCount) => {
	return (
		<View style={styles.totalActivities}>
			<Text style={styles.totalActivitiesHeading}>Total Activities: </Text>
			<Text style={styles.totalActivitiesValue}>{activityCount}</Text>
		</View>
	);
};

const Leaderboard = ({ navigation }) => {
	const leaderboardData = useSelector(selectLeaderboard);

	const dispatch = useDispatch();
	const fetchLeaderboard = useCallback(
		(userId) => dispatch(leaderboardActions.fetchLeaderboard(userId)),
		[dispatch]
	);

	useEffect(() => {
		fetchLeaderboard();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openUserActivity = (_id) => {
		navigation.navigate('UserActivity', { userId: _id });
	};

	const TopUser = ({ data }) => {
		const { photoUrl, displayName, count, _id } = data;
		return (
			<TouchableOpacity style={styles.topUser} onPress={() => openUserActivity(_id)}>
				<Text style={[styles.rankNumber, { fontSize: variables.font.large }]}>1</Text>
				{renderDisplayPhoto(photoUrl)}
				<Text style={styles.displayName}>{displayName || 'Name not available'}</Text>
				{renderTotalActivities(count)}
			</TouchableOpacity>
		);
	};

	const SecondThirdTopUser = ({ data }) => {
		const secondUser = data[0];
		const thirdUser = data[1];

		const UserCard = ({ user, rank }) => (
			<TouchableOpacity
				style={styles.secondThirdUserCard}
				onPress={() => openUserActivity(user._id)}
			>
				<Text style={[styles.rankNumber, { paddingRight: variables.space.base }]}>{rank}</Text>
				<View>
					{renderDisplayPhoto(user.photoUrl)}
					<Text style={styles.displayName}>{user.displayName || 'Name not available'}</Text>
					{renderTotalActivities(user.count)}
				</View>
			</TouchableOpacity>
		);

		return (
			<View style={styles.secondThirdTopUserContainer}>
				{data[0] && <UserCard user={secondUser} rank={2} />}
				{data[1] && <UserCard user={thirdUser} rank={3} />}
			</View>
		);
	};

	const renderNormaUserRow = ({ item, index }) => {
		const { photoUrl, displayName, count, _id } = item;

		return (
			<TouchableOpacity style={styles.normalUserRow} onPress={() => openUserActivity(_id)}>
				<Text
					style={[
						styles.rankNumber,
						{ paddingLeft: variables.space.base, paddingRight: variables.space.base },
					]}
				>
					{index + 4}
				</Text>
				<View style={{ paddingRight: variables.space.base }}>{renderDisplayPhoto(photoUrl)}</View>
				<Text style={styles.displayName}>{displayName || 'Name not available'}</Text>
				<View
					style={{
						flex: 1,
						display: 'flex',
						alignItems: 'flex-end',
						paddingRight: variables.space.base,
					}}
				>
					{renderTotalActivities(count)}
				</View>
			</TouchableOpacity>
		);
	};

	if (!leaderboardData || !leaderboardData.length) {
		return (
			<View style={styles.fallbackContainer}>
				<Text>Leaderboard data is not available at the moment.</Text>
			</View>
		);
	}

	const topUser = leaderboardData[0];

	const secondThirdUser = leaderboardData.slice(1, 3);

	const normalUsers = leaderboardData.slice(3);

	return (
		<View style={styles.leaderboard}>
			<View style={styles.firstRow}>
				<TopUser data={topUser} />
				<SecondThirdTopUser data={secondThirdUser} />
			</View>

			<View style={styles.normalUserContainer}>
				<FlatList
					style={styles.listview}
					data={normalUsers}
					extraData={normalUsers}
					renderItem={renderNormaUserRow}
					keyExtractor={(item, index) => index + ''}
				/>
			</View>
		</View>
	);
};

Leaderboard.navigationOptions = () => {
	return { headerTitle: 'Leaderboard' };
};

export default Leaderboard;
