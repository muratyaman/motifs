import { IBaseDto, ILogger, RedisClient } from '../types';

export class NotifierForRedis<T extends IBaseDto> {

  constructor(
    public readonly channelId: string,
    protected readonly logger: ILogger,
    protected readonly r: RedisClient,
  ) {
    logger.debug('new NotifierForRedis ' + channelId);
  }

  async notify(e: T) {
    this.logger.debug('NotifierForRedis.notify ' + this.channelId + ' => ' + JSON.stringify(e));
    await this.r.publish(this.channelId, JSON.stringify(e));
  }
}
