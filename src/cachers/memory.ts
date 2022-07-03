import NodeCache from 'node-cache';
import { MotifsErrorNotFound } from '../errors';
import { BaseCacher } from './base';
import { ICacher } from './types';

export class CacherWithMemory extends BaseCacher implements ICacher {

  constructor(
    protected readonly r: NodeCache,
  ) {
    super();
  }

  protected async _keys(search: string): Promise<string[]> {
    const keys = this.r.keys();
    const re = new RegExp(search.replaceAll('*', '.*'));
    return keys.filter(k => re.test(k));
  }

  protected async _set(key: string, val: unknown, expiryMs: number): Promise<boolean> {
    this.r.set(key, val, expiryMs / 1000);
    return true;
  }

  protected async _get<T>(key: string): Promise<T> {
    const val = this.r.get<T>(key);
    if (!val) throw new MotifsErrorNotFound();
    return val;
  }

  protected async _del(key: string): Promise<boolean> {
    this.r.del(key);
    return true;
  }
}
