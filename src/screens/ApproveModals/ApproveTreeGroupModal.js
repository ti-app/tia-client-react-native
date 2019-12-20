import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	StyleSheet,
	Image,
	ScrollView,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';
import { View, Text, Button } from 'native-base';

import * as colors from '../../styles/colors';
import * as treeActions from '../../store/actions/tree.action';
import { selectSelectedTreeGroup } from '../../store/reducers/tree.reducer';

const ApproveTreeGroupModal = ({ visible, approveType, onClose }) => {
	const selectedTreeGroup = useSelector(selectSelectedTreeGroup);

	const dispatch = useDispatch();
	const takeModActionForTreeGroup = useCallback(
		(...param) => dispatch(treeActions.takeModActionForTreeGroup(...param)),
		[dispatch]
	);

	const handleModeratorAction = (approval) => {
		const { id } = selectedTreeGroup;
		if (approveType === 'ADD') {
			takeModActionForTreeGroup(id, { approve: approval });
		} else if (approveType === 'DELETE') {
			takeModActionForTreeGroup(id, { deleteApprove: approval });
		} else {
			console.warn("Pass 'approveType' as a prop.");
		}
		onClose();
	};

	const getFormattedDate = (date) => new Date(date).toDateString().substr(4, 12);

	const getApproveText = () => {
		if (approveType === 'ADD') {
			return 'APPROVE';
		}
		if (approveType === 'DELETE') {
			return 'DELETE';
		}
		console.warn("Pass 'approveType' as a prop.");
		return '';
	};

	if (!selectedTreeGroup) return null;

	const photo = selectedTreeGroup ? selectedTreeGroup.photo : null;
	const { owner, uploadedDate, trees } = selectedTreeGroup;
	const formattedUploadedDate = uploadedDate && getFormattedDate(uploadedDate);

	const plantTypes = Array.from(new Set(trees.map((_) => _.plantType)));
	const healths = Array.from(new Set(trees.map((_) => _.health)));

	return (
		<Modal animationType="slide" transparent visible={visible} onRequestClose={() => onClose()}>
			<TouchableOpacity
				style={styles.container}
				onPressOut={() => {
					onClose();
				}}
			>
				<TouchableWithoutFeedback>
					<View style={styles.content}>
						<View style={styles.heading}>
							<Text style={styles.plantType}>
								{plantTypes && plantTypes.length
									? plantTypes.join(', ')
									: 'Plant type not specified'}
							</Text>
						</View>

						<View style={styles.treeDetailsContainer}>
							<ScrollView contentContainerStyle={styles.treeDetails}>
								<Text style={styles.plantInfo}>No. of plants: {trees.length}</Text>
								{owner && owner.displayName && (
									<Text style={styles.plantInfo}>Uploaded by : {owner.displayName}</Text>
								)}
								{formattedUploadedDate && (
									<Text style={styles.plantInfo}>Created on {formattedUploadedDate}</Text>
								)}
								<Text style={styles.plantInfo}>Health: {healths.join(', ')}</Text>
								{photo && photo.length > 0 ? (
									<Image
										source={{
											uri: photo,
										}}
										resizeMode="contain"
										style={styles.image}
									/>
								) : (
									<View style={styles.imageNotFound}>
										<Text style={styles.imageNotFoundText}>No Image.</Text>
									</View>
								)}
							</ScrollView>
						</View>
						<View style={styles.actionButtonContainer}>
							<Button
								style={{
									...styles.actionButton,
								}}
								success
								onPress={() => handleModeratorAction(true)}
							>
								<Text style={styles.actionButtonText}>{getApproveText()}</Text>
							</Button>
							<Button
								style={{
									...styles.actionButton,
								}}
								danger
								onPress={() => handleModeratorAction(false)}
							>
								<Text style={styles.actionButtonText}>REJECT</Text>
							</Button>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	content: {
		backgroundColor: colors.white,
		height: '50%',
		width: '90%',
		display: 'flex',
		justifyContent: 'center',
	},
	treeDetails: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-around',
		paddingRight: 16,
		paddingLeft: 16,
		paddingTop: 8,
		paddingBottom: 16,
	},
	heading: {
		display: 'flex',
		flexDirection: 'row',
		paddingRight: 16,
		paddingLeft: 16,
	},
	plantType: {
		textAlignVertical: 'center',
		fontSize: 20,
	},
	plantInfo: {
		fontSize: 12,
		color: colors.gray,
	},
	actionButtonContainer: {
		position: 'absolute',
		left: 10,
		right: 10,
		bottom: 10,
		backgroundColor: 'white',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	actionButton: {
		justifyContent: 'center',
		marginRight: 10,
		marginLeft: 10,
		flex: 1,
	},
	actionButtonText: { textAlign: 'center' },
	image: { width: '100%', height: 150 },
	imageNotFound: {
		width: '100%',
		height: 150,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: colors.lightGray,
	},
	imageNotFoundText: { textAlign: 'center' },
});

export default ApproveTreeGroupModal;
