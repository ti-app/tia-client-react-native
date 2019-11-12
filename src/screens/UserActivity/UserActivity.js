import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';
import { View, Container } from 'native-base';

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
		const { activity, date } = anActivity;

		const { icon, iconProvider, iconColor, title } = getActivityDetails(activity);

		return {
			time: formatTimestamp(date)
				.split(',')
				.join('\n'),
			title,
			icon,
			iconProvider,
			iconColor,
		};
	});

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
});

UserActivity.navigationOptions = ({ navigation }) => {
	return { headerTitle: 'User Activity' };
};

export default UserActivity;
