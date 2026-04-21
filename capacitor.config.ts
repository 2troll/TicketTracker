import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tickettracker.app',
  appName: 'TicketTracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    edgeToEdge: true,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    StatusBar: {
      style: 'Default',
      backgroundColor: '#00000000',
      overlaysWebView: true,
    },
  },
};

export default config;
