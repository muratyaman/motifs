export interface IListener<T = unknown> {
  listen(channelId: string): Promise<void>;
  onMessage(msgObj: T): Promise<void>;
  //stop(): Promise<void>;
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
