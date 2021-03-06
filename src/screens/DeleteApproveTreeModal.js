import React from 'react';
import { connect } from 'react-redux';
import {
	StyleSheet,
	Image,
	ScrollView,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
} from 'react-native';
import { View, Text, Button } from 'native-base';

import * as colors from '../styles/colors';
import { takeModActionForTree } from '../store/actions/tree.action';

class ApproveTreeModal extends React.Component {
	handleModeratorAction = (approval) => {
		const { takeModActionForTree, selectedTree, onClose } = this.props;
		const { _id } = selectedTree;
		takeModActionForTree(_id, { deleteApprove: approval });
		onClose();
	};

	getFormattedDate = (date) => new Date(date).toDateString().substr(4, 12);

	render() {
		const { selectedTree, visible, onClose } = this.props;

		if (!selectedTree) return null;

		const photo = selectedTree ? selectedTree.photo : null;
		const { health, owner, uploadedDate, plantType } = selectedTree;
		const formattedUploadedDate = uploadedDate && this.getFormattedDate(uploadedDate);

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
								<Text style={styles.plantType}>{plantType || 'Plant type not specified'}</Text>
							</View>

							<View style={styles.treeDetailsContainer}>
								<ScrollView contentContainerStyle={styles.treeDetails}>
									{owner && owner.displayName && (
										<Text style={styles.plantInfo}>Uploaded by : {owner.displayName}</Text>
									)}
									{formattedUploadedDate && (
										<Text style={styles.plantInfo}>Created on {formattedUploadedDate}</Text>
									)}
									<Text style={styles.plantInfo}>Health: {health}</Text>
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
									onPress={() => this.handleModeratorAction(true)}
								>
									<Text style={styles.actionButtonText}>DELETE</Text>
								</Button>
								<Button
									style={{
										...styles.actionButton,
									}}
									danger
									onPress={() => this.handleModeratorAction(false)}
								>
									<Text style={styles.actionButtonText}>REJECT</Text>
								</Button>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</TouchableOpacity>
			</Modal>
		);
	}
}

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
	healthy: { color: colors.green },
	adequate: { color: colors.linkBlue },
	average: { color: colors.yellow },
	weak: { color: colors.orange },
	almostDead: { color: colors.red },
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

const mapStateToProps = (state) => ({
	selectedTree: state.tree.selectedTree,
});

const mapDispatchToProps = (dispatch) => ({
	takeModActionForTree: (...param) => dispatch(takeModActionForTree(...param)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApproveTreeModal);
