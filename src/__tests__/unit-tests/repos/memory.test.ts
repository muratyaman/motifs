import { expect } from 'chai';
import { MotifsErrorDuplicate, MotifsErrorNotFound } from '../../../errors';
import { makeRepo, RepoWithMemory } from '../../../repos';
import { EventManager, IBaseDto } from '../../../types';

describe('Repositories', async () => {

  interface IUser extends IBaseDto {
    username: string;
    role    : number;
  }

  const em = new EventManager();
  const repo = await makeRepo<IUser>({ kind: 'memory', name: 'users' }, em);

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

  describe('Memory repo', () => {

    it('should be loaded', () => {
      expect(repo instanceof RepoWithMemory).to.eq(true);
    });

    for (const user of [user1, user2, user3]) {
      it('should create user', async () => {
        const created = await repo.create(user);
        expect(typeof created === 'object').to.eq(true);
        expect('createdAt' in user).to.eq(true);
      });
    }

    it('should throw error when creating a user with same ID', async () => {
      try {
        await repo.create(user1);
        expect(false, 'error expected').to.eq(true);
      } catch (err) {
        expect(err instanceof MotifsErrorDuplicate).to.eq(true);
      }
    });

    it('should list users', async () => {
      const users = await repo.findMany({ role: 1 });
      expect(Array.isArray(users)).to.eq(true);
    });

    it('should retrieve a user', async () => {
      const found1 = await repo.retrieve(user1.id ?? '');
      expect(found1.id).to.eq(user1.id ?? '');
    });

    it('should throw error when retrieving an unknown user', async () => {
      try {
        await repo.retrieve('x');
        expect(false, 'error expected').to.eq(true);
      } catch (err) {
        expect(err instanceof MotifsErrorNotFound).to.eq(true);
      }
    });

    it('should update a user', async () => {
      const change = { role: 3 };
      const updated = await repo.update(user3.id ?? '', change);
      expect(typeof updated === 'object').to.eq(true);
    });

    it('should delete a user', async () => {
      const deleted = await repo.delete_(user3.id ?? '');
      expect(deleted).to.eq(true);
    });

  });

});
