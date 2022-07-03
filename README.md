# motifs

Library for implementation of certain patterns (motifs) like the following.

## Caching Pattern

Ref: [https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside](https://docs.microsoft.com/en-us/azure/architecture/patterns/cache-aside)

* Memory using [node-cache](https://www.npmjs.com/package/node-cache)
* Redis using [redis](https://www.npmjs.com/package/redis)

```ts
export interface ICacher {
  setItem                  (key: string, val: unknown, expiryMs: number): Promise<boolean>;
  getItem<T= unknown>      (key: string)                                : Promise<T>;
  delItem                  (key: string)                                : Promise<boolean>;
  getItemsLike<T = unknown>(keyPrefix: string)                          : Promise<Record<string, T>>;
  getKeys                  (search: string)                             : Promise<string[]>;
}
```

## Observer (Message Listener) Pattern

* Kafka using [kafkajs](https://www.npmjs.com/package/kafkajs)
* PostgreSQL using [pg](https://www.npmjs.com/package/pg)
* RabbitMQ using [amqplib](https://www.npmjs.com/package/amqplib)
* Redis using [redis](https://www.npmjs.com/package/redis)

We are expecting to listen to a channel and messages will be sent in a particular type.

```ts
export interface IListener<T = unknown> {
  listen(channelId: string): Promise<void>;
  onMessage(msgObj: T): Promise<void>;
}
```

## Repository Pattern

Ref: [https://martinfowler.com/eaaCatalog/repository.html](https://martinfowler.com/eaaCatalog/repository.html)

* Memory using [node-cache](https://www.npmjs.com/package/node-cache)
* Redis using [redis](https://www.npmjs.com/package/redis)

We are expecting to run simple CRUD operations on a "collection" of objects, table of records or document store.

```ts
export interface IRepo<T extends IBaseDto = IBaseDto> {
  name: string;
  em  : Emittery; // internal event manager

  findMany (conditions: IFlatObject)    : Promise<T[]>;
  create   (dto: Partial<T>)            : Promise<T>;
  retrieve (id: string)                 : Promise<T>;
  update   (id: string, dto: Partial<T>): Promise<T>;
  delete_  (id: string)                 : Promise<boolean>;
}
```
