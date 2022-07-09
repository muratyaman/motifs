import { Pool } from 'pg';
import { IBaseDto, ILogger } from '../types';
import { pgEncodeToSend } from '../utils';

// @see https://www.postgresql.org/docs/current/sql-notify.html

export class NotifierForPg<T extends IBaseDto> {

  constructor(
    public readonly channelId: string,
    protected readonly logger: ILogger,
    protected readonly p: Pool,
  ) {
    logger.debug('new NotifierForPg ' + channelId);
  }

  async notify(e: T) {
    this.logger.debug('NotifierForPg.notify ' + this.channelId + ' => ' + JSON.stringify(e));
    const client  = await this.p.connect();
    const message = pgEncodeToSend(e);
    const query   = `NOTIFY "${this.channelId}", '${message}'`;
    await client.query(query);
  }
}
