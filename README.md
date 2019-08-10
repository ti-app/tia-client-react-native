# Setup (Currently for Android Only)

1: Clone the repo and `cd` to root directory.

2: Install the depedencies.

```
yarn install
```

3: We are using React Native modules with native Java code that isn't converted to AndroidX, and our app is AndroidX. That is why following command:

```
npx jetify
```

4: Create `.env` file in root, copy content from `https://ti-app.slack.com/archives/CE68JUXPC/p1564943184000300` and paste it in the file.

5: (Optional) Create `.prettierrc` in root and add your config ;)

6: Ensure that emulator is on or an android device is connected with `adb` setup properly.

7: Run following command in seperate terminal (not in integrated terminal of vscode).

```
react-native run-android
```

8: Now get your headphones on and spill out pure fire. TIA.

# Build

## Debug Build:

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

```bash
keytool -genkey -v -keystore "C:\Users\aksha\.android\debug.keystore" -storepass android -alias androiddebugkey -keypass android -dname "CN=Android Debug,O=Android,C=US"
```

For following error && Running on Device:

`error Could not install the app on the device, read the error above for details. Make sure you have an Android emulator running or a device connected and have set up your Android development environment:`

```
adb kill-server
adb start-server
```

Facing problem with blocked port:
`https://stackoverflow.com/a/55450873/5692089`

# Samples

(Yet To Add)

# TODO:

(Yet To Add)
