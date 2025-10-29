jest.mock('react-native-ble-plx', () => {
  class MockCharacteristic {
    constructor(uuid) { this.uuid = uuid; }
    writeWithResponse = jest.fn(async () => {});
  }
  class MockService {
    constructor(uuid) { this.uuid = uuid; }
    characteristics = async () => [new MockCharacteristic('e6eae575-4d89-4750-bf3e-c82d6a1cd299')];
  }
  class MockDevice {
    id = 'mock-id';
    name = 'BLE-Secure-Server';
    connect = async () => this;
    isConnected = async () => true;
    discoverAllServicesAndCharacteristics = async () => this;
    services = async () => [new MockService('8c30f045-683a-4777-8d21-87def63e4ef5')];
  }
  class BleManager {
    startDeviceScan = (_filter, _opts, listener) => {
      setTimeout(() => listener(null, new MockDevice(), null), 0);
    };
    stopDeviceScan = () => {};
  }
  return { BleManager, Device: MockDevice };
});

jest.mock('react-native-biometrics', () => {
  return function () {
    return {
      simplePrompt: async () => ({ success: true })
    };
  };
});

