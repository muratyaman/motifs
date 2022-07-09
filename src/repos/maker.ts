import NodeCache from 'node-cache';
import { createClient } from 'redis';
import { EventManager, IBaseDto } from '../types';
import { RepoWithMemory } from './memory';
import { RepoWithRedis } from './redis';
import { IRepoConfig } from './types';

export async function makeRepo<T extends IBaseDto = IBaseDto>(conf: IRepoConfig, em: EventManager) {

  if (conf.kind === 'redis' && conf.redis) {
    const redisClient = createClient({ url: conf.redis.url });
    await redisClient.connect();
    return new RepoWithRedis<T>(conf.name, em, redisClient);
  }

  return new RepoWithMemory<T>(conf.name, em, new NodeCache({ stdTTL: 0, checkperiod: 0 }));
}
