import { EventManager, IBaseDto, IFlatObject } from '../types';

export interface IRepo<T extends IBaseDto = IBaseDto> {
  name: string;
  em  : EventManager;

  findMany (conditions: IFlatObject)    : Promise<T[]>;
  create   (dto: Partial<T>)            : Promise<T>;
  retrieve (id: string)                 : Promise<T>;
  update   (id: string, dto: Partial<T>): Promise<T>;
  delete_  (id: string)                 : Promise<boolean>;
}

export interface IRepoConfig {
  kind: 'memory' | 'redis';
  name: string;
  redis?: {
    url: string;
  };
}
