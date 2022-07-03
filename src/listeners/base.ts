import Emittery from 'emittery';
import { IListener, IListenerErrorHandler, IListenerMessageHandler } from './types';

export abstract class BaseListener<T = unknown> implements IListener<T> {

  constructor(
    public readonly channelId: string,
    public readonly em: Emittery,
  ) {
    // do nothing
  }

  abstract listen(): Promise<void>;
  //abstract stop(): Promise<void>;

  onMessage(handler: IListenerMessageHandler<T>): void {
    this.em.on('message', handler);
  }

  onError(handler: IListenerErrorHandler): void {
    this.em.on('error', handler);
  }

  protected async _onMessage(msgObj: T) {
    await this.em.emit('message', msgObj);
  }

  protected async _onError(err: unknown) {
    await this.em.emit('error', err);
  }
}
