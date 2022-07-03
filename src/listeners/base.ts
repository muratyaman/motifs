import Emittery from 'emittery';
import { IListener } from './types';

export abstract class BaseListener<T = unknown> implements IListener<T> {

  constructor(
    public readonly channelId: string,
    public readonly em: Emittery,
  ) {
    // do nothing
  }

  abstract listen(): Promise<void>;
  //abstract stop(): Promise<void>;

  async onMessage(msgObj: T) {
    await this.em.emit('message', msgObj);
  }

  async onError(err: unknown) {
    await this.em.emit('error', err);
  }
}
