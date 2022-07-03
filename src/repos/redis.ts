
import Emittery from 'emittery';
import { MotifsErrorNotFound } from '../errors';
import { IBaseDto, IFlatObject } from '../types';
import { BaseRepo } from './base';
import { IRepo, RedisClient } from './types';

export class RepoWithRedis<T extends IBaseDto = IBaseDto> extends BaseRepo<T> implements IRepo<T> {

  constructor(public name: string, public em: Emittery, protected r: RedisClient) {
    super(name, em);
  }

  protected _filter(row: T, conditions: IFlatObject): boolean {
    const filters = Object.entries(conditions);
    const matchRequired = filters.length;
    let match = 0;
    for (const[k, v] of filters) {
      if ((k in row) && (typeof row[k] === typeof v) && (row[k] === v)) match += 1;
    }
    return match === matchRequired;
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
