import { expect } from 'chai';
import Emittery from 'emittery';
import NodeCache from 'node-cache';
import { RepoWithMemory } from '../repos';
import { IBaseDto } from '../types';

describe('User repo', () => {

  interface IUser extends IBaseDto {
    username: string;
    role    : number;
  }

  const em = new Emittery();
  const repo = new RepoWithMemory<IUser>('users', em, new NodeCache({ stdTTL: 0, checkperiod: 0 }));

  const user1: Partial<IUser> = {
    username: 'haci',
    role    : 1,
  };

  const user2: Partial<IUser> = {
    username: 'murat',
    role    : 1,
  };

  const user3: Partial<IUser> = {
    username: 'yaman',
    role    : 2,
  };

  it('should be loaded', () => {
    expect(repo instanceof RepoWithMemory).to.eq(true);
  });

  for (const user of [user1, user2, user3]) {
    it('should create users', async () => {
      const created = await repo.create(user);
      expect(typeof created === 'object').to.eq(true);
      expect('createdAt' in user).to.eq(true);
      console.log({ user, created });
    });
  }

  it('should list users', async () => {
    const users = await repo.findMany({ role: 1 });
    expect(Array.isArray(users)).to.eq(true);
    console.log({ users });
  });

  it('should retrieve a user', async () => {
    const found1 = await repo.retrieve(user1.id ?? '');
    expect(found1.id).to.eq(user1.id ?? '');
    console.log({ found1 });
  });

  it('should update a user', async () => {
    const change = { role: 3 };
    const updated = await repo.update(user3.id ?? '', change);
    expect(typeof updated === 'object').to.eq(true);
    console.log({ updated });
  });

  it('should delete a user', async () => {
    const deleted = await repo.delete_(user3.id ?? '');
    expect(deleted).to.eq(true);
    console.log({ deleted });
  });
});
