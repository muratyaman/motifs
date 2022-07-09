
import { MotifsErrorNotFound } from '../errors';
import { EventManager, IBaseDto, RedisClient } from '../types';
import { BaseRepo } from './base';
import { IRepo } from './types';

export class RepoWithRedis<T extends IBaseDto = IBaseDto> extends BaseRepo<T> implements IRepo<T> {

  constructor(
    public name: string,
    public em: EventManager,
    protected r: RedisClient,
  ) {
    super(name, em);
  }

  protected async _keys(): Promise<string[]> {
    return this.r.KEYS(this._key('*'));
  }

  protected async _set(key: string, dto: Partial<T>) {
    const json = JSON.stringify(dto);
    await this.r.SET(key, json);
    return true;
  }

  protected async _get(key: string): Promise<T> {
    const json = await this.r.GET(key);
    if (!json) throw new MotifsErrorNotFound();
    return JSON.parse(json) as T; // pretending
  }

  protected async _del(key: string): Promise<boolean> {
    await this.r.DEL(key);
    return true;
  }
}
