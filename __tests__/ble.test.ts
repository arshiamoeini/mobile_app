import { DoorBleClient } from '../src/ble';
import { BleManager } from 'react-native-ble-plx';

// Mock biometrics module with controllable behavior
const mockSimplePrompt = jest.fn(async () => ({ success: true }));

jest.mock('react-native-biometrics', () => {
  return jest.fn(() => ({
    simplePrompt: mockSimplePrompt
  }));
});

import { checkBiometricsOrPasscode } from '../src/biometrics';

describe('BLE client', () => {
  beforeEach(() => {
    // Reset mock to default success behavior before each test
    mockSimplePrompt.mockResolvedValue({ success: true });
  });
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

  it('opens door only when biometrics succeed', async () => {
    const manager = new BleManager();
    const client = new DoorBleClient(manager);
    await client.scanAndConnect(2000);

    // @ts-ignore - access mock characteristic from setup
    const ch = await client.ensureCharacteristic();
    const spy = jest.spyOn(ch, 'writeWithResponse');

    await checkBiometricsOrPasscode('Authenticate to unlock door');
    await client.unlockDoor();

    expect(spy).toHaveBeenCalled();
  });

  it('does NOT open door when biometrics fail', async () => {
    // Override mock to simulate biometric failure
    mockSimplePrompt.mockResolvedValueOnce({ success: false });

    const manager = new BleManager();
    const client = new DoorBleClient(manager);
    await client.scanAndConnect(2000);

    // @ts-ignore - access mock characteristic
    const ch = await client.ensureCharacteristic();
    const spy = jest.spyOn(ch, 'writeWithResponse');

    try {
      await checkBiometricsOrPasscode('Authenticate to unlock door');
      // If above doesn't throw, we should not reach unlockDoor
      await client.unlockDoor();
    } catch (_e) {
      // Expected: biometrics should throw when success is false
    }

    expect(spy).not.toHaveBeenCalled();
  });
});


