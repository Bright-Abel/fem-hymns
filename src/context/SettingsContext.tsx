import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface SettingsState {
  horizontalScroll: boolean;
  theme: ThemeMode;
  fontSize: number;
  repeatAudioByStanza: boolean;
  autoPlayAudio: boolean;
}

interface SettingsContextType extends SettingsState {
  setHorizontalScroll: (val: boolean) => void;
  setTheme: (val: ThemeMode) => void;
  setFontSize: (val: number) => void;
  setRepeatAudioByStanza: (val: boolean) => void;
  setAutoPlayAudio: (val: boolean) => void;
}

const STORAGE_KEY = '@church_hymnal_settings_v1';

const defaultSettings: SettingsState = {
  horizontalScroll: false,
  theme: 'dark',
  fontSize: 20,
  repeatAudioByStanza: false,
  autoPlayAudio: false,
};

function parseSettings(value: string | null): SettingsState {
  if (!value) return defaultSettings;

  try {
    const parsed = JSON.parse(value) as Partial<SettingsState>;
    return {
      ...defaultSettings,
      ...parsed,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      fontSize:
        typeof parsed.fontSize === 'number' && Number.isFinite(parsed.fontSize)
          ? parsed.fontSize
          : defaultSettings.fontSize,
    };
  } catch {
    return defaultSettings;
  }
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);
  const { setColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setSettings(parseSettings(stored));
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setHydrated(true);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    setColorScheme(settings.theme);
  }, [settings.theme, setColorScheme]);

  useEffect(() => {
    if (!hydrated) return;

    async function saveSettings() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.error('Failed to save settings:', e);
      }
    }

    saveSettings();
  }, [hydrated, settings]);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  if (!hydrated) return null;

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setHorizontalScroll: (val) => updateSetting('horizontalScroll', val),
        setTheme: (val) => updateSetting('theme', val),
        setFontSize: (val) => updateSetting('fontSize', val),
        setRepeatAudioByStanza: (val) =>
          updateSetting('repeatAudioByStanza', val),
        setAutoPlayAudio: (val) => updateSetting('autoPlayAudio', val),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error('useSettings must be used inside a SettingsProvider');
  return ctx;
}
