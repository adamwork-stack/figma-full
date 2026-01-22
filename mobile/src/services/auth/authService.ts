import {StorageService} from '../storage/storageService';
import {STORAGE_KEYS} from '../../utils/constants';

export class AuthService {
  static async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      StorageService.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      StorageService.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  }

  static async getAccessToken(): Promise<string | null> {
    return await StorageService.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await StorageService.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static async clearTokens(): Promise<void> {
    await Promise.all([
      StorageService.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      StorageService.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      StorageService.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  }

  static async saveUserData(userData: any): Promise<void> {
    await StorageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }

  static async getUserData(): Promise<any | null> {
    const data = await StorageService.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }
}
