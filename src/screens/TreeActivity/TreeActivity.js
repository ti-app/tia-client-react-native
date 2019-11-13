import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';
import { View, Container, Text } from 'native-base';

import VerticalTimeline from '../../shared/VerticalTimeline/VerticalTimeline';
import * as variables from '../../styles/variables';
import * as activityActions from '../../store/actions/activity.action';
import { selectTreeActivities } from '../../store/reducers/activity.reducer';
import { selectSelectedTree } from '../../store/reducers/tree.reducer';
import { formatTimestamp } from '../../utils/date-time';
import { getActivityDetails } from '../../utils/misc';

const TreeActivity = ({ navigation }) => {
	const activities = useSelector(selectTreeActivities);
	const tree = useSelector(selectSelectedTree);

	const dispatch = useDispatch();
	const fetchActivities = useCallback(
		(treeId) => dispatch(activityActions.fetchTreeActivities(treeId)),
		[dispatch]
	);

	useEffect(() => {
		if (tree && tree._id) {
			fetchActivities(tree._id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tree]);

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
				<Text>No Tree Activities available for this tree.</Text>
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

TreeActivity.navigationOptions = ({ navigation }) => {
	return { headerTitle: 'Tree Activity' };
};

export default TreeActivity;
