import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, Platform } from 'react-native';
import { DoorBleClient } from './ble';
import { checkBiometricsOrPasscode } from './biometrics';

let client: DoorBleClient;
if (Platform.OS === 'web') {
    client = new DoorBleClient();
} else {
    // Use runtime require to avoid loading native BLE module on web
    const { BleManager } = require('react-native-ble-plx');
    client = new DoorBleClient(new BleManager());
}

export default function App() {
    const [status, setStatus] = useState<string>('Idle');

    const onConnect = async () => {
        try {
            setStatus('Scanning...');
            await client.scanAndConnect();
            setStatus('Connected');
        } catch (e) {
            setStatus(`Error: ${(e as Error).message}`);
        }
    };

    const onUnlock = async () => {
        try {
            setStatus('Authenticating...');
            await checkBiometricsOrPasscode('Authenticate to unlock door');
            setStatus('Unlocking...');
            await client.unlockDoor();
            setStatus('Door opened');
        } catch (e) {
            setStatus(`Error: ${(e as Error).message}`);
        }
    };

    const onClose = async () => {
        try {
            setStatus('Closing...');
            await client.closeDoor();
            setStatus('Door closed');
        } catch (e) {
            setStatus(`Error: ${(e as Error).message}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.title}>Door Unlock</Text>
                <Text style={styles.status}>{status}</Text>
                <View style={styles.row}>
                    <Button title="Connect" onPress={onConnect} />
                </View>
                <View style={styles.row}>
                    <Button title="Unlock" onPress={onUnlock} />
                </View>
                <View style={styles.row}>
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#101214' },
    inner: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { color: 'white', fontSize: 24, marginBottom: 16, textAlign: 'center' },
    status: { color: '#9fb', marginBottom: 24, textAlign: 'center' },
    row: { marginVertical: 8 }
});


