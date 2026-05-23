import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "nursafar_token";
const USER_KEY = "nursafar_user";

export const storage = {
  async saveToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },


  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },


  async removeToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },


  async saveUser(user: object) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },


  async getUser<T>(): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },



  async removeUser() {
    await SecureStore.deleteItemAsync(USER_KEY);
  },



  async clearAll() {
    await Promise.allSettled([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },
};



