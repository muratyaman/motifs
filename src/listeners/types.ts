import { EventManager } from '../types';

export interface IListener<T = unknown> {
  channelId: string;
  em       : EventManager; // internal event manager

  listen(): Promise<void>;
  onMessage(handler: IListenerMessageHandler<T>): void;
  onError(handler: IListenerErrorHandler): void;
  //stop(): Promise<void>;
}

export interface IListenerMessageHandler<T = unknown> {
  (msgObj: T): Promise<void>;
}

export interface IListenerErrorHandler {
  (err: unknown): Promise<void>;
}

export interface IListenerConfig {
  kind     : 'kafka' | 'pg' | 'rabbitmq' | 'redis';
  channelId: 'string';
  kafka?: {
    url      : string;  // e.g. 'localhost:9092'
    clientId?: string;
    groupId? : string;
  };
  pg?: {
    url: string; // e.g. 'postgresql://user:password@server:5432/db-name'
  };
  rabbitmq?: {
    url: string; // e.g. 'amqp://localhost'
  };
  redis?: {
    url: string; // e.g. 'redis://localhost:6379'
  };
}
