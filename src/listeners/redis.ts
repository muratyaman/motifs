import Emittery from 'emittery';
import { RedisClient } from '../types';
import { noOp } from '../utils';
import { BaseListener } from './base';
import { IListener } from './types';

export class RedisListener<T = unknown> extends BaseListener<T> implements IListener {
  constructor(
    public channelId: string,
    public readonly em: Emittery,
    public readonly r: RedisClient,
  ) {
    super(channelId, em);
  }

  async listen(): Promise<void> {
    await this.r.subscribe(this.channelId, (msg: string) => {
      try {
        const msgObj = JSON.parse(msg) as T; // pretend
        this.onMessage(msgObj).then(noOp).catch(noOp); // trick
      } catch (err) {
        this.onError(err).then(noOp).catch(noOp); // trick
      }
    })
  }
}
