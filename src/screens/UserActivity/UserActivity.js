import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';
import { View, Container, Text } from 'native-base';

import VerticalTimeline from '../../shared/VerticalTimeline/VerticalTimeline';
import * as variables from '../../styles/variables';
import * as activityActions from '../../store/actions/activity.action';
import { selectUserActivities } from '../../store/reducers/activity.reducer';
import { selectUser } from '../../store/reducers/auth.reducer';
import { formatTimestamp } from '../../utils/date-time';
import { getActivityDetails } from '../../utils/misc';

const UserActivity = ({ navigation }) => {
	const activities = useSelector(selectUserActivities);
	const user = useSelector(selectUser);

	const dispatch = useDispatch();
	const fetchActivities = useCallback(
		(userId) => dispatch(activityActions.fetchUserActivities(userId)),
		[dispatch]
	);

	useEffect(() => {
		if (user && user.uid) {
			fetchActivities(user.uid);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const data = (activities || []).map((anActivity) => {
		const { activity, date: activityTimestamp } = anActivity;

		const { icon, iconProvider, iconColor, title } = getActivityDetails(activity);

		const { date, time } = formatTimestamp(activityTimestamp);

		return {
			time: `${date}\n${time}`,
			title,
			icon,
			iconProvider,
			iconColor,
		};
	});

	if (!data || !data.length) {
		return (
			<View style={styles.fallbackContainer}>
				<Text>No Activities available for you.</Text>
			</View>
		);
	}

	return (
		<Container style={styles.container}>
			<View style={styles.verticalTimelineContainer}>
				<VerticalTimeline data={data} />
			</View>
		</Container>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
	},
	verticalTimelineContainer: {
		flex: 1,
		paddingTop: variables.space.base,
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

UserActivity.navigationOptions = ({ navigation }) => {
	return { headerTitle: 'User Activity' };
};

export default UserActivity;
