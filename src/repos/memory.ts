import NodeCache from 'node-cache';
import Emittery from 'emittery';
import { MotifsErrorNotFound } from '../errors';
import { IBaseDto } from '../types';
import { BaseRepo } from './base';
import { IRepo } from './types';

export class RepoWithMemory<T extends IBaseDto = IBaseDto> extends BaseRepo<T> implements IRepo<T> {

  constructor(public name: string, public em: Emittery, protected r: NodeCache) {
    super(name, em);
  }

  protected async _keys(): Promise<string[]> {
    return this.r.keys();
  }

  protected async _set(key: string, dto: Partial<T>) {
    await this.r.set(key, dto);
    return true;
  }

  protected async _get(key: string): Promise<T> {
    const dto = await this.r.get(key);
    if (!dto) throw new MotifsErrorNotFound();
    return dto as T;
  }

  protected async _del(key: string): Promise<boolean> {
    await this.r.del(key);
    return true;
  }
}
