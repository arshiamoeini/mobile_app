import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { encode as b64encode } from 'base-64';

export const SERVICE_UUID = '8c30f045-683a-4777-8d21-87def63e4ef5';
export const CHARACTERISTIC_UUID = 'e6eae575-4d89-4750-bf3e-c82d6a1cd299';
export const DEVICE_NAME = 'BLE-Secure-Server';

export class DoorBleClient {
    private manager: BleManager;
    private device: Device | null = null;
    private characteristic: Characteristic | null = null;

    constructor(manager?: BleManager) {
        this.manager = manager ?? new BleManager();
    }

    async scanAndConnect(timeoutMs: number = 10000): Promise<Device> {
        if (this.device && await this.device.isConnected()) return this.device;

        return new Promise<Device>((resolve, reject) => {
            const timer = setTimeout(() => {
                this.manager.stopDeviceScan();
                reject(new Error('Scan timeout'));
            }, timeoutMs);

            this.manager.startDeviceScan(null, { allowDuplicates: false }, async (error: unknown, device: any) => {
                if (error) {
                    clearTimeout(timer);
                    this.manager.stopDeviceScan();
                    reject(error);
                    return;
                }
                if (!device) return;
                if (device.name !== DEVICE_NAME) return;
                try {
                    clearTimeout(timer);
                    this.manager.stopDeviceScan();
                    const connected = await device.connect();
                    await connected.discoverAllServicesAndCharacteristics();
                    this.device = connected;
                    resolve(connected);
                } catch (e) {
                    reject(e as Error);
                }
            });
        });
    }

    async ensureCharacteristic(): Promise<Characteristic> {
        if (this.characteristic) return this.characteristic;
        if (!this.device) throw new Error('Not connected');
        const services = await this.device.services();
        for (const s of services) {
            if (s.uuid.toLowerCase() !== SERVICE_UUID) continue;
            const chars = await s.characteristics();
            const ch = chars.find((c: any) => c.uuid.toLowerCase() === CHARACTERISTIC_UUID);
            if (ch) {
                this.characteristic = ch;
                return ch;
            }
        }
        throw new Error('Characteristic not found');
    }

    async unlockDoor(): Promise<void> {
        const ch = await this.ensureCharacteristic();
        // Protocol: write "1" to open, "2" to close
        const valueBase64 = b64encode('1');
        await ch.writeWithResponse(valueBase64);
    }

    async closeDoor(): Promise<void> {
        const ch = await this.ensureCharacteristic();
        const valueBase64 = b64encode('2');
        await ch.writeWithResponse(valueBase64);
    }
}


