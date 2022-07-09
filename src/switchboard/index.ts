import { EventManager, ILogger } from '../types';

export class SwitchBoard {

  constructor(
    protected readonly logger: ILogger,
    protected readonly em: EventManager,
  ) {
    // do nothing
  }

  listen<T>(channelId: string, receiver: IMessageReceiver<T>) {
    this.logger.debug('SwitchBoard.listen ' + JSON.stringify({ channelId }));
    this.em.on(channelId, receiver);
  }

  async notify<T>(channelId: string, message: Partial<T>) {
    this.logger.debug('SwitchBoard.notify' + JSON.stringify({ channelId, message }));
    await this.em.emit(channelId, message);
  }
}

export interface IMessageReceiver<T> {
  (msg: T): Promise<void>;
}

export interface IMessageSender<T> {
  (msg: T): Promise<void>;
}
