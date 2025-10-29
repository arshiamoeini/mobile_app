// Web shim for biometrics. Not available on web.
export async function checkBiometricsOrPasscode(prompt: string = 'Authenticate to unlock'): Promise<void> {
    if (typeof console !== 'undefined') {
        console.warn(`[biometrics.web] ${prompt} — biometrics not supported on web, simulating success`);
    }
    // Simulate success so the rest of the UI can be exercised on web
    return;
}


