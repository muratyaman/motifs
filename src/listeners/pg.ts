import { Pool } from 'pg';
import { EventManager } from '../types';
import { noOp, pgDecodeReceived } from '../utils';
import { BaseListener } from './base';
import { IListener } from './types';

// @see https://www.postgresql.org/docs/current/sql-listen.html

export class PgListener<T = unknown> extends BaseListener<T> implements IListener {

  constructor(
    public channelId: string,
    public readonly em: EventManager,
    public readonly p: Pool,
  ) {
    super(channelId, em);
  }

  async listen(): Promise<void> {
    try {
      const client = await this.p.connect();

      const handleMsg = async (msg: Notification) => {
        console.debug('PgListener consuming message...');
        try {
          const msgObj = pgDecodeReceived<T>(msg.payload ?? ''); // pretend
          await this._onMessage(msgObj);
        } catch (err) {
          await this._onError(err);
        }
      }

      const query = `LISTEN "${this.channelId}"`;
      const res   = await client.query(query);
      console.debug('PgListener', res);
      client.on('notification', handleMsg);

    } catch (err) {
      return this._onError(err).then(noOp).catch(noOp);
    }
  }
}

interface Notification {
  processId: number;
  channel  : string;
  payload? : string;
}
