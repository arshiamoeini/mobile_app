import ReactNativeBiometrics from 'react-native-biometrics';

export async function checkBiometricsOrPasscode(prompt: string = 'Authenticate to unlock'): Promise<void> {
    const rnBiometrics = new ReactNativeBiometrics();
    const { success } = await rnBiometrics.simplePrompt({ promptMessage: prompt });
    if (!success) throw new Error('Biometric authentication failed');
}


