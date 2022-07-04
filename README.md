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
  channelId: string;
  em       : Emittery; // internal event manager

  listen(): Promise<void>;
  onMessage(handler: IListenerMessageHandler<T>): void;
  onError(handler: IListenerErrorHandler): void;
}
export interface IListenerMessageHandler<T = unknown> {
  (msgObj: T): Promise<void>;
}
export interface IListenerErrorHandler {
  (err: unknown): Promise<void>;
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

## Examples

Sample usage for cacher, repo and listener/observer:

```ts
import express from 'express';
import { IBaseDto, makeCacher, makeListener, makeRepo, MotifsErrorNotFound } from 'motifs';

main();

async function main() {
  const app = express();

  app.use(express.json());

  const cacheExpiry10Mins = 10 * 60 * 1000;

  const contactCacher = await makeCacher({ kind: 'memory' });

  const contactRepo = await makeRepo<IContact>({ kind: 'memory', name: 'contacts' });

  contactRepo.em.on('contacts.create.after', async ({ dto }) => {
    console.info('contact created', dto);
  });

  const contractListener = await makeListener<IAlienContactCreated>({ channelId: 'mars', kind: 'kafka', kafka: { url: 'localhost:9092' } });

  contractListener.onMessage(async (msg: IAlienContactCreated) => {
    console.info('new contact', msg);
  });
  contractListener.listen();

  app.post('/contacts', (req, res) => {
    const contact: IContact = req.body as IContact; // TODO: avoid pretending, validate
    const data = await contactRepo.create(contact);
    res.json({ data });
  });

  app.get('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const key = `contacts/${id}`;
    try {
      const cached = await contactCacher.getItem<IContact>(key);
      return res.json({ data: cached });
    } catch (err) { // cache miss?
      try {
        const contact = await contactRepo.retrieve(id);
        await contactCacher.setItem(key, contact, cacheExpiry10Mins); // cache aside
        res.json({ data: contact });
      } catch (err) {
        if (err instanceof MotifsErrorNotFound) {
          res.status(404),json({ error: 'not found' });
        } else {
          console.error(err);
          res.status(500).json({ error: 'server error' });
        }
      }
    }
  });

  app.listen(8080);
}

interface IContact extends IBaseDto {
  firstName: string;
  lastName:  string;
  dob:       string;
}

interface IAlienContactCreated {
  id?    : string;
  planet?: string;
}
```
