import { MotifsErrorNotFound } from '../errors';
import { RedisClient } from '../types';
import { BaseCacher } from './base';
import { ICacher } from './types';

export class CacherWithRedis extends BaseCacher implements ICacher {

  constructor(
    protected readonly r: RedisClient,
  ) {
    super();
  }

  protected async _keys(search: string): Promise<string[]> {
    return this.r.KEYS(search);
  }

  protected async _set(key: string, val: unknown, expiryMs: number) {
    const json = JSON.stringify(val);
    await this.r.SET(key, json, { EX: expiryMs });
    return true;
  }

  protected async _get<T = unknown>(key: string): Promise<T> {
    const json = await this.r.GET(key);
    if (!json) throw new MotifsErrorNotFound();
    return JSON.parse(json) as T; // pretending
  }

  protected async _del(key: string): Promise<boolean> {
    await this.r.DEL(key);
    return true;
  }
}
