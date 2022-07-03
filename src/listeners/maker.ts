import Emittery from 'emittery';
import amqplib from 'amqplib';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { RedisListener } from './redis';
import { IListener, IListenerConfig } from './types';
import { RabbitListener } from './rabbit';
import { PgListener } from './pg';
import { Kafka } from 'kafkajs';
import { KafkaListener } from './kafka';

export async function makeListener(conf: IListenerConfig): Promise<IListener> {

  const em = new Emittery();

  if (conf.kind === 'kafka' && conf.kafka) {
    const k = new Kafka({ clientId: conf.kafka.clientId ?? 'motifs', brokers: [ conf.kafka.url ] });
    const kc = k.consumer({ groupId: conf.kafka.groupId ?? 'motifs' });
    const listener1 = new KafkaListener(conf.channelId, em, kc);
    await listener1.listen();
    return listener1;
  }

  if (conf.kind === 'pg' && conf.pg) {
    const p = new Pool({ connectionString: conf.pg.url });
    await p.connect();
    const listener2 = new PgListener(conf.channelId, em, p);
    await listener2.listen();
    return listener2;
  }

  if (conf.kind === 'redis' && conf.redis) {
    const re = createClient({ url: conf.redis.url });
    await re.connect();
    const listener3 = new RedisListener(conf.channelId, em, re);
    await listener3.listen();
    return listener3;
  }

  if (conf.kind ==='rabbitmq' && conf.rabbitmq) {
    const ra = await amqplib.connect(conf.rabbitmq.url);
    const listener4 = new RabbitListener(conf.channelId, em, ra);
    await listener4.listen();
    return listener4;
  }

  throw new Error('Unknown listener kind');
}
