declare module 'react-native-ble-plx' {
  export class BleManager {
    startDeviceScan(filter: any, options: any, listener: (error: unknown, device: Device | null) => void): void;
    stopDeviceScan(): void;
  }
  export interface Service {
    uuid: string;
    characteristics(): Promise<Characteristic[]>;
  }
  export interface Characteristic {
    uuid: string;
    writeWithResponse(valueBase64: string): Promise<void>;
  }
  export class Device {
    id: string;
    name?: string | null;
    connect(): Promise<Device>;
    isConnected(): Promise<boolean>;
    discoverAllServicesAndCharacteristics(): Promise<Device>;
    services(): Promise<Service[]>;
  }
}

declare module 'base-64' {
  export function encode(input: string): string;
  export function decode(input: string): string;
}

