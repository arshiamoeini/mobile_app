// Web shim for BLE. Expo web cannot use react-native-ble-plx.
export const SERVICE_UUID = '8c30f045-683a-4777-8d21-87def63e4ef5';
export const CHARACTERISTIC_UUID = 'e6eae575-4d89-4750-bf3e-c82d6a1cd299';
export const DEVICE_NAME = 'BLE-Secure-Server';

type WebCharacteristic = {};

export class DoorBleClient {
    private device: null = null;
    private characteristic: WebCharacteristic | null = null;

    constructor() {
        // Intentionally empty; web does not support BLE via this library
        if (typeof console !== 'undefined') {
            console.warn('[ble.web] Loaded web BLE shim. BLE is not supported on web.');
        }
    }

    async scanAndConnect(): Promise<any> {
        throw new Error('BLE scanning is not supported on web');
    }

    async ensureCharacteristic(): Promise<WebCharacteristic> {
        throw new Error('BLE characteristic access is not supported on web');
    }

    async unlockDoor(): Promise<void> {
        throw new Error('Unlock is not supported on web');
    }

    async closeDoor(): Promise<void> {
        throw new Error('Close is not supported on web');
    }
}


