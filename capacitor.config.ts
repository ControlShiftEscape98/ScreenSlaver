import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'app.screenslaver.studio',
    appName: 'ScreenSlaver',
    webDir: 'dist',
    server: {
        // In production, the app loads from the bundled dist/ folder.
        // Uncomment below to load from your live URL instead (useful for dev):
        // url: 'https://screenslaver.app',
        androidScheme: 'https'
    },
    plugins: {
        SplashScreen: {
            launchAutoHide: true,
            launchShowDuration: 2000,
            backgroundColor: '#0a0a0f',
            showSpinner: false
        },
        StatusBar: {
            style: 'DARK',
            backgroundColor: '#0a0a0f'
        }
    },
    android: {
        allowMixedContent: true,
        backgroundColor: '#0a0a0f'
    }
};

export default config;
