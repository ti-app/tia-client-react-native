#!/usr/bin/env bash
function copyEnvVarsToKeyStoreProperties {
    KEY_STORE_PROPERTIES_FILE=${HOME}"/tia-client-react-native/android/release.keystore.properties"
    export KEY_STORE_PROPERTIES_FILE
    echo "Key store properties"

    if [ ! -f "$KEY_STORE_PROPERTIES_FILE" ]; then
        echo "Key store Properties does not exist"

        echo "Creating key store file..."
        touch $KEY_STORE_PROPERTIES_FILE

        echo "Writing TIA_UPLOAD_STORE_FILE to release.keystore.properties..."
        echo "TIA_UPLOAD_STORE_FILE=$TIA_UPLOAD_STORE_FILE" >> $GRADLE_PROPERTIES

        echo "Writing TIA_UPLOAD_KEY_ALIAS to release.keystore.properties..."
        echo "TIA_UPLOAD_KEY_ALIAS=$TIA_UPLOAD_KEY_ALIAS" >> $GRADLE_PROPERTIES

        echo "Writing TIA_UPLOAD_STORE_PASSWORD to release.keystore.properties..."
        echo "TIA_UPLOAD_STORE_PASSWORD=$TIA_UPLOAD_STORE_PASSWORD" >> $GRADLE_PROPERTIES

        echo "Writing TIA_UPLOAD_KEY_PASSWORD to release.keystore.properties..."
        echo "TIA_UPLOAD_KEY_PASSWORD=$TIA_UPLOAD_KEY_PASSWORD" >> $GRADLE_PROPERTIES
    fi
}