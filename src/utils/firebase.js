import Config from 'react-native-config';
import * as firebase from 'firebase';

const {
	FIREBASE_CONFIG_API_KEY,
	FIREBASE_CONFIG_AUTH_DOMAIN,
	FIREBASE_CONFIG_DATABASE_URL,
	FIREBASE_CONFIG_PROJECT_ID,
	FIREBASE_CONFIG_STORAGE_BUCKET,
	FIREBASE_CONFIG_MESSAGING_SENDER_ID,
} = Config;

export const initializeFirebase = () => {
	if (!firebase.apps.length) {
		const firebaseConfig = {
			apiKey: FIREBASE_CONFIG_API_KEY,
			authDomain: FIREBASE_CONFIG_AUTH_DOMAIN,
			databaseURL: FIREBASE_CONFIG_DATABASE_URL,
			projectId: FIREBASE_CONFIG_PROJECT_ID,
			storageBucket: FIREBASE_CONFIG_STORAGE_BUCKET,
			messagingSenderId: FIREBASE_CONFIG_MESSAGING_SENDER_ID,
		};
		firebase.initializeApp(firebaseConfig);
	}
};
