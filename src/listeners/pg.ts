import { Pool } from 'pg';
import Emittery from 'emittery';
import { noOp } from '../utils';
import { BaseListener } from './base';
import { IListener } from './types';

export class PgListener<T = unknown> extends BaseListener<T> implements IListener {

  constructor(
    public channelId: string,
    public readonly em: Emittery,
    public readonly p: Pool,
  ) {
    super(channelId, em);
  }

  async listen(): Promise<void> {
    try {
      const client = await this.p.connect();

      const handleMsg = async (msg: Notification) => {
        console.debug('pg listener consuming message...');
        try {
          const msgObj = JSON.parse(msg.payload ?? '{}') as T; // pretend
          await this.onMessage(msgObj).then(noOp).catch(noOp);
        } catch (err) {
          return this.onError(err).then(noOp).catch(noOp);
        }
      }

      client.query('LISTEN ' + this.channelId);
      client.on('notification', handleMsg);

    } catch (err) {
      return this.onError(err).then(noOp).catch(noOp);
    }
  }
}

interface Notification {
  processId: number;
  channel  : string;
  payload? : string;
}
