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

---

## Release Build:

1: Get `release.keystore.properties` from `https://ti-app.slack.com/files/UE5JTSF4Z/FM8GFQT6Y/release.keystore.properties` and put it in `./android` directory.

2: Get `tiarelase.keystore` from `https://ti-app.slack.com/files/UE5JTSF4Z/FLXHA0YUT/tiarelease.keystore` and put it in `./android/app` directory.

3: Generate a release build.

```
cd android
./gradlew assembleRelease
```

# Resources

Generating sha1 for google-api:
`https://aboutreact.com/getting-sha1-fingerprint-for-google-api-console/`

# Troubleshooting

- After changing your styles.xml in android/app/src/main/res/values if you get an error "Failed to capture fingerprint of output files for task ':app:processDebugResources' property 'sourceOutputDir' during up-to-date check." error, do following and run again:

```
cd android
./gradlew clean
cd ..
react-native run-android
```

- Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the --reset-cache flag to the start script:

```
npm start --reset-cache
# or
yarn start --reset-cache
```

- If you get an error like Nullable is not a symbol or something, try this:
  `https://stackoverflow.com/a/56681395`

* For following error && Running on Device:

`error Could not install the app on the device, read the error above for details. Make sure you have an Android emulator running or a device connected and have set up your Android development environment:`

```
adb kill-server
adb start-server
```

- Facing problem with blocked port:
  `https://stackoverflow.com/a/55450873/5692089`

- Getting SHA1 (mostly for firebase) from keystore

Note: For debug keystore `storepass` and `keypass` are generally `android`.

```
keytool -list -v -alias {alias-name} -keystore {path-too-keystore}
```

- Getting key hash for facebook.

```
keytool -exportcert -alias {alias-name} -keystore {path-to-keystore} | openssl sha1 -binary | openssl base64
```

- For `Execution failed for task ':app:mergeReleaseResources' Error: Duplicate resources`:

`https://stackoverflow.com/a/52750886/5692089`

There is a script named `android-release-gradle-fix` under `./scripts` directory which will do the necessary changes to troubleshoot the above error. For script to run properly, remove the `node_modules` and run `yarn install` again.

```
rm -rf node_modules

yarn install
```

- If you run npm install on ci like jenkins, you may get error: postinstall: cannot run in `wd %s %s (wd=%s) node` => just use

```
yarn install --unsafe-perm instead
```

# Samples

(Yet To Add)

# TODO:

(Yet To Add)
