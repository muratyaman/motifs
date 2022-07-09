import { MotifsErrorDuplicate, MotifsErrorNotFound } from '../errors';
import { EventManager, IBaseDto, IFlatObject } from '../types';
import { makeKeyMaker, ts, uuid } from '../utils';
import { IRepo } from './types';

export abstract class BaseRepo<T extends IBaseDto = IBaseDto> implements IRepo<T> {
  protected _key: (id: string) => string;

  protected abstract _keys(): Promise<string[]>;
  protected abstract _set(key: string, dto: Partial<T>): Promise<boolean>;
  protected abstract _get(key: string): Promise<T>;
  protected abstract _del(key: string): Promise<boolean>;

  constructor(public name: string, public em: EventManager) {
    this._key = makeKeyMaker(name);
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

  async findMany(conditions: IFlatObject): Promise<T[]> {
    const keys = await this._keys();
    const rows: T[] = [];
    for (const key of keys) {
      const row = await this._get(key);
      if (this._filter(row, conditions)) rows.push(row);
    }
    return rows;
  }

  async create(dto: Partial<T>): Promise<T> {
    try {
      const now     = ts();
      dto.id        = dto.id ? dto.id : uuid();
      dto.createdAt = dto.createdAt ? dto.createdAt : now;
      dto.updatedAt = dto.updatedAt ? dto.updatedAt : now;
      const found   = await this.retrieve(dto.id);
      if (found) throw new MotifsErrorDuplicate();
    } catch (err) {
      if (err instanceof MotifsErrorDuplicate) throw err;
    }
    await this.em.emit(`${this.name}.create.before`, { dto });
    const key    = this._key(dto.id ?? '');
    const result = await this._set(key, dto);
    await this.em.emit(`${this.name}.create.after`, { dto, result });
    return dto as T; // pretending
  }

  async retrieve(id: string): Promise<T> {
    const key = this._key(id);
    const dto = await this._get(key);
    if (!dto) throw new MotifsErrorNotFound();
    return dto as T; // pretending
  }

  async update(id: string, change: Partial<T>): Promise<T> {
    const key    = this._key(id);
    const oldDto = await this._get(key);
    const merged = { ...oldDto, ...change, id, updatedAt: ts() }; // not allowed to change id
    await this.em.emit(`${this.name}.update.before`, { oldDto, change });
    const result = await this._set(key, merged);
    await this.em.emit(`${this.name}.update.after`, { oldDto, change, result });
    return merged;
  }

  async delete_(id: string): Promise<boolean> {
    const key    = this._key(id);
    const oldDto = await this._get(key);
    await this.em.emit(`${this.name}.delete.before`, { oldDto });
    const result = await this._del(key);
    await this.em.emit(`${this.name}.delete.after`, { oldDto, result });
    return true;
  }
}
