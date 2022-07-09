import { Consumer, ConsumerSubscribeTopics, EachMessagePayload } from 'kafkajs';
import { EventManager } from '../types';
import { noOp } from '../utils';
import { BaseListener } from './base';
import { IListener } from './types';

export class KafkaListener<T = unknown> extends BaseListener<T> implements IListener {

  constructor(
    public channelId: string,
    public readonly em: EventManager,
    public readonly k: Consumer,
  ) {
    super(channelId, em);
  }

  async listen(): Promise<void> {

    try {
      const subscribeOptions: ConsumerSubscribeTopics = {
        topics       : [ this.channelId ],
        fromBeginning: true,
      };
  
      await this.k.subscribe(subscribeOptions);

      const handleMsg = async (msg: EachMessagePayload) => {
        console.debug('KafkaListener consuming message...');
        try {
          const msgStr = msg?.message?.value?.toString('utf-8') ?? '{}';
          const msgObj = JSON.parse(msgStr) as T; // pretend
          await this._onMessage(msgObj).then(noOp).catch(noOp);
        } catch (err) {
          return this._onError(err).then(noOp).catch(noOp);
        }
      }

      await this.k.run({ eachMessage: handleMsg });

    } catch (err) {
      return this._onError(err).then(noOp).catch(noOp);
    }
  }
}
