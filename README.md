# Setup

# Build

Step 1:

```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

Step 2:

```
cd android/
./gradlew assembleDebug
```

You can find the build here: `app/build/outputs/apk/`

# Resources

Generating sha1 for google-api:
`https://aboutreact.com/getting-sha1-fingerprint-for-google-api-console/`

# Troubleshooting

After changing your styles.xml in android/app/src/main/res/values if you get an error "Failed to capture fingerprint of output files for task ':app:processDebugResources' property 'sourceOutputDir' during up-to-date check." error, do following and run again:

```
cd android
./gradlew clean
cd ..
react-native run-android
```

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the --reset-cache flag to the start script:

```
npm start --reset-cache
# or
yarn start --reset-cache
```

If you get an error like Nullable is not a symbol or something, try this:
`https://stackoverflow.com/a/56681395`

Generating Keystore:

```
keytool -genkey -v -keystore "C:\Users\aksha\.android\debug.keystore" -storepass android -alias androiddebugkey -keypass android -dname "CN=Android Debug,O=Android,C=US"
```

# Samples

Nothing right now.

# TODO:

Nothing right now.
