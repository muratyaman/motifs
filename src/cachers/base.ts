import { MotifsErrorNotFound } from '../errors';
import { ICacher } from './types';

export abstract class BaseCacher implements ICacher {

  protected abstract _keys(search: string): Promise<string[]>;
  protected abstract _set(key: string, val: unknown, expiryMs: number): Promise<boolean>;
  protected abstract _get<T>(key: string): Promise<T>;
  protected abstract _del(key: string): Promise<boolean>;

  async setItem(key: string, val: unknown, expiryMs: number): Promise<boolean> {
    await this._set(key, val, expiryMs);
    return true;
  }

  async getItem<T = unknown>(key: string): Promise<T> {
    const val = await this._get<T>(key);
    if (!val) throw new MotifsErrorNotFound();
    return val;
  }

  async delItem(key: string): Promise<boolean> {
    await this._del(key);
    return true;
  }

  async getItemsLike<T = unknown>(keyPrefix: string): Promise<Record<string, T>> {
    const items: Record<string, T> = {};
    const keys = await this.getKeys(`${keyPrefix}*`);
    for (const key of keys) {
      items[key] = await this.getItem<T>(key);
    }
    return items;
  }

  async getKeys(search: string): Promise<string[]> {
    return this._keys(search);
  }

}
