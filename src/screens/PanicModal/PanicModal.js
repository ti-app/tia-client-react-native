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

const PanicModal = ({ data, visible, onClose }) => {
	if (!data) return null;

	const { photo, googlePlaceName, owner, panicType } = data;

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
							<Text>Panic</Text>
						</View>
						<View style={styles.panicDetailsContainer}>
							<ScrollView contentContainerStyle={styles.treeDetails}>
								<Text>Location:{googlePlaceName}</Text>
								<Text>Panic raised by: {owner.displayName}</Text>
								<Text>Panic type: {panicType}</Text>

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
								onPress={() => {
									onClose();
								}}
							>
								<Text style={styles.actionButtonText}>OK</Text>
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
		// justifyContent: 'space-around',
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
		// position: 'absolute',
		// top: 0,
		display: 'flex',
		flexDirection: 'row',
		paddingRight: 16,
		paddingLeft: 16,
	},
	plantType: {
		textAlignVertical: 'center',
		fontSize: 20,
	},
	panicLocation: {
		fontSize: 16,
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

export default PanicModal;
