import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import firebase from 'firebase';

export default class InitialLoadinScreen extends React.Component {
	componentDidMount() {
		// const { navigation } = this.props;
		// firebase.auth().onAuthStateChanged(user => {
		//   console.log(user);
		// });
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Life without love is like a tree without blossoms or fruit.</Text>
				<ActivityIndicator size="large" />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

// import React from 'react';
// import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// export default () => {
//   return (
//     <View style={styles.container}>
//       <Text>Life without love is like a tree without blossoms or fruit.</Text>
//       <ActivityIndicator size="large" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });
