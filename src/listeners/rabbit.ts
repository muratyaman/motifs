import { ConsumeMessage } from 'amqplib';
import Emittery from 'emittery';
import { RabitClient } from '../types';
import { noOp } from '../utils';
import { BaseListener } from './base';
import { IListener } from './types';

export class RabbitListener<T = unknown> extends BaseListener<T> implements IListener {

  constructor(
    public channelId: string,
    public readonly em: Emittery,
    public readonly r: RabitClient,
  ) {
    super(channelId, em);
  }

  async listen(): Promise<void> {

    try {
      const ch = await this.r.createChannel();
      const assertOptions = { durable: false };
      const assertResult = await ch.assertQueue(this.channelId, assertOptions);
      console.debug({ assertResult });

      const handleMsg = (msg: ConsumeMessage | null) => {
        console.debug('rabbitmq listener consuming message...');
        try {
          if (!msg) {
            console.debug('Consumer cancelled by server');
            return;
          }
          const msgStr = msg?.content.toString('utf-8') ?? '{}';
          const msgObj = JSON.parse(msgStr) as T; // pretend

          const afterMsg = () => {
            try {
              ch.ack(msg); // acknowledge on when there is no error * * *
            } catch (err) {
              console.error('error on acknowledge', err);
            }
          }

          return this._onMessage(msgObj).then(afterMsg).catch(noOp);
        } catch (err) {
          return this._onError(err).then(noOp).catch(noOp);
        }
      }

      const consumeOptions = { noAck: true };
      const consumeResult = await ch.consume(this.channelId, handleMsg, consumeOptions);
      console.debug({ consumeResult });
    } catch (err) {
      return this._onError(err).then(noOp).catch(noOp);
    }
  }
}
