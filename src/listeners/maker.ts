import Emittery from 'emittery';
import amqplib from 'amqplib';
import { createClient } from 'redis';
import { RedisListener } from './redis';
import { IListener, IListenerConfig } from './types';
import { RabbitListener } from './rabbit';

export async function makeListener(conf: IListenerConfig): Promise<IListener> {

  const em = new Emittery();

  if (conf.kind === 'redis' && conf.redis) {
    const re = createClient({ url: conf.redis.url });
    await re.connect();
    const listener1 = new RedisListener(conf.channelId, em, re);
    await listener1.listen();
    return listener1;
  }

  if (conf.kind ==='rabbitmq' && conf.rabbitmq) {
    const ra = await amqplib.connect(conf.rabbitmq.url);
    const listener2 = new RabbitListener(conf.channelId, em, ra);
    await listener2.listen();
    return listener2;
  }

  throw new Error('Unknown listener kind');
}
