import { Dispatch, SetStateAction, useEffect } from "react";
import { Settings } from "./SettingsStoreTypes";
import { DEFAULT_SETTINGS, LOCAL_STORAGE_KEY } from "./SettingsStoreConstants";
import { DebugLog } from "@/common/functions/dev";

const debugLog = DebugLog(DebugLog.DEBUGS.settingsStore);

export function useLoadSettings(setSettings: Dispatch<SetStateAction<Settings>>) {
  useEffect(() => {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
    const state = storedSettings ? JSON.parse(storedSettings) as Settings : DEFAULT_SETTINGS;
    debugLog(`Loaded (from ${storedSettings ? 'storage' : 'default'})`, state);
    setSettings({ ...state, updated: storedSettings ? Date.now() : undefined });
  }, []);
}

export function useSettingsFunctions(settings: Settings, setSettings: Dispatch<SetStateAction<Settings>>) {
  return {
    get: <Key extends keyof Settings>(key: Key): Settings[Key] | undefined => settings[key],
    update: (update: SetStateAction<Partial<Settings>>) => {
      debugLog('Settings update', update);
      setSettings(settings => ({
        ...settings,
        ...typeof update === 'function' ? update(settings) : update,
        updated: Date.now(),
      }));
    },
    reset: () => setSettings(DEFAULT_SETTINGS),
    save: () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
      debugLog('Settings saved', settings);
    }
  };
}