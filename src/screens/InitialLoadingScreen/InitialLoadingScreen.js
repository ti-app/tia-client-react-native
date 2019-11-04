import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const InitialLoadingScreen = () => (
	<View style={styles.container}>
		<Text>Life without love is like a tree without blossoms or fruit.</Text>
		<ActivityIndicator size="large" />
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default InitialLoadingScreen;
