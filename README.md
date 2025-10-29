# Door Unlock Mobile App

Connects to the BLE IoT device and unlocks the door after biometric/passcode.

- Device name: `BLE-Secure-Server`
- Service UUID: `8c30f045-683a-4777-8d21-87def63e4ef5`
- Characteristic UUID: `e6eae575-4d89-4750-bf3e-c82d6a1cd299`
- Protocol: write ASCII "1" (open) or "2" (close) as Base64
- Pairing: Static passkey `999999` shown by OS pairing sheet

## Run

```bash
npm install
npm test
```

I'll scan the IoT device sketch to extract the BLE service/characteristic UUIDs, pairing method, and unlock write protocol so the mobile app can connect and authenticate correctly. Then I'll scaffold a React Native (TypeScript) app with BLE connect/handshake and a simple Jest test that mocks a connection.

[1 tool called]

I'll create a minimal React Native TypeScript app scaffold with BLE connect/handshake and a biometrics gate, plus a Jest test that mocks the BLE connection and verifies the unlock write. Then I'll start adding the files.

[1 tool called]

I'll generate the project files for a minimal React Native TypeScript app, including BLE client, UI, biometrics module, Jest config, and README.

[1 tool called]

I’m going to add the React Native TypeScript scaffold, BLE client, biometrics module, UI, Jest setup, a sample test, and a README. Then I’ll mark the scaffold task complete and start implementing the BLE client logic.

[12 tools called]

I created a minimal React Native TypeScript app with BLE connect/handshake, a biometrics gate, a simple UI, a mocked Jest setup, and a test that verifies the unlock write using your IoT sketch’s UUIDs and protocol.

- What I’ll do next: run the Jest test locally and, if you want, add Android/iOS permission notes.

Key files:
- BLE settings from your device:
```1:12:c:\Users\user\Desktop\work\mobile app\mobile_app.ino
#define SERVICE_UUID        "8c30f045-683a-4777-8d21-87def63e4ef5"
#define CHARACTERISTIC_UUID "e6eae575-4d89-4750-bf3e-c82d6a1cd299"
#define PASSKEY 999999
```
- BLE client using those UUIDs: `src/ble.ts`
- Biometrics gate: `src/biometrics.ts`
- Simple UI: `src/App.tsx`
- Test: `__tests__/ble.test.ts`
- Jest mocks: `jest.setup.js`

Run:
- npm install
- npm test

Status: scaffold, BLE client, biometrics, UI, README are done; the test is added and ready.

- Added BLE connect flow: scan by name `BLE-Secure-Server`, connect, discover, write Base64("1") to unlock and Base64("2") to close.
- Biometric prompt required before unlock.

If you prefer native Android (Kotlin) or iOS (Swift) instead of React Native, say which and I’ll generate that version.

- I pulled the service/characteristic and passkey from `mobile_app.ino` and aligned the client accordingly.
- The test mocks BLE and asserts the write is called; it doesn’t require hardware.



