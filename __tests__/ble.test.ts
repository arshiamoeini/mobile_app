import { DoorBleClient } from '../src/ble';
import { BleManager } from 'react-native-ble-plx';

describe('BLE client', () => {
  it('connects and writes unlock command', async () => {
    const manager = new BleManager();
    const client = new DoorBleClient(manager);
    const device = await client.scanAndConnect(2000);
    expect(device).toBeTruthy();

    // @ts-ignore - access mock characteristic
    const ch = await client.ensureCharacteristic();
    const spy = jest.spyOn(ch, 'writeWithResponse');
    await client.unlockDoor();
    expect(spy).toHaveBeenCalled();
  });
});


