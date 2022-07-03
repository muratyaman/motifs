export interface IListener<T = unknown> {
  listen(channelId: string): Promise<void>;
  onMessage(msgObj: T): Promise<void>;
  //stop(): Promise<void>;
}

export interface IListenerConfig {
  kind     : 'kafka' | 'rabbitmq' | 'redis';
  channelId: 'string';
  redis?: {
    url: string; // e.g. 'redis://localhost:6379'
  };
  rabbitmq?: {
    url: string; // e.g. 'amqp://localhost'
  };
}
