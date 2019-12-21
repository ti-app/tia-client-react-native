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

const PanicModal = ({ visible, approveType, onClose }) => {
	const dispatch = useDispatch();

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
						<View style={styles.heading}></View>
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

export default PanicModal;
