import '../global.css';

import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { initializeHymnalDatabase } from '@/services/hymnService';

SplashScreen.preventAutoHideAsync();

// Brand colors from your church logo
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0B131F',
    card: '#132032',
    text: '#FFFFFF',
    border: '#1D2F47',
    primary: '#005697',
    notification: '#E31D2B',
  },
};

const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
    primary: '#005697',
    notification: '#E31D2B',
  },
};

function RootNavigation() {
  const { theme } = useSettings();
  const activeTheme = theme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  return (
    <ThemeProvider value={activeTheme}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tab)' />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'rubik-regular': require('../../assets/fonts/Rubik-Regular.ttf'),
    'rubik-bold': require('../../assets/fonts/Rubik-Bold.ttf'),
    'rubik-extrabold': require('../../assets/fonts/Rubik-ExtraBold.ttf'),
    'rubik-medium': require('../../assets/fonts/Rubik-Medium.ttf'),
    'rubik-semibold': require('../../assets/fonts/Rubik-SemiBold.ttf'),
    'rubik-light': require('../../assets/fonts/Rubik-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SettingsProvider>
      <SQLiteProvider
        databaseName='hymnal-v2.db'
        assetSource={{
          assetId: require('../../assets/hymnal.db'),
          forceOverwrite: false,
        }}
        useSuspense={false}
        onInit={initializeHymnalDatabase}
        onError={(error) =>
          console.error('Failed to load hymnal database:', error)
        }
      >
        <RootNavigation />
      </SQLiteProvider>
    </SettingsProvider>
  );
}
