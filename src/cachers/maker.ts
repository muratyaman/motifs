import NodeCache from 'node-cache';
import { createClient } from 'redis';
import { CacherWithMemory } from './memory';
import { CacherWithRedis } from './redis';
import { ICacher, ICacherConfig } from './types';

export async function makeCacher(conf: ICacherConfig): Promise<ICacher> {

  if (conf.kind === 'redis' && conf.redis) {
    const r = createClient({ url: conf.redis.url });
    await r.connect();
    return new CacherWithRedis(r);
  }

  return new CacherWithMemory(new NodeCache({ stdTTL: 0, checkperiod: 5 }));
}
