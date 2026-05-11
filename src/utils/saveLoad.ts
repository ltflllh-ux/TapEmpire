import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVE_KEY = "tapempire_save";

export async function saveGame(state: object): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // silent fail
  }
}

export async function loadGame(): Promise<object | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
