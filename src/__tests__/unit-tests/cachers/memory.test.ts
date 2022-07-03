import { expect } from 'chai';
import { CacherWithMemory, makeCacher } from '../../../cachers';
import { MotifsErrorNotFound } from '../../../errors';

describe('Cachers', async () => {

  interface IUser {
    username : string;
    firstName: string;
    lastName : string;
    role     : number;
  }

  const expiryMs = 10000;

  const repo = await makeCacher({ kind: 'memory' });

  const user1: IUser = {
    username : 'yaman1',
    firstName: 'Haci',
    lastName:  'Yaman',
    role    : 1,
  };

  const user2: IUser = {
    username:  'yaman2',
    firstName: 'Esra',
    lastName:  'Yaman',
    role    : 1,
  };

  const user3: IUser = {
    username:  'john',
    firstName: 'John',
    lastName:  'Smith',
    role    : 2,
  };

  describe('Memory cacher', () => {

    it('should be loaded', () => {
      expect(repo instanceof CacherWithMemory).to.eq(true);
    });

    for (const user of [user1, user2, user3]) {
      it('should create user', async () => {
        const created = await repo.setItem(user.username, user, expiryMs);
        expect(created).to.eq(true);
      });
    }

    it('should list users', async () => {
      const users = await repo.getItemsLike<IUser>('ama');
      expect(typeof users === 'object').to.eq(true);
      expect('yaman1' in users).to.eq(true);
    });

    it('should retrieve a user', async () => {
      const found1 = await repo.getItem<IUser>(user1.username);
      expect(found1.username).to.eq(user1.username);
    });

    it('should throw error when retrieving an unknown user', async () => {
      try {
        await repo.getItem('x');
        expect(false, 'error expected').to.eq(true);
      } catch (err) {
        expect(err instanceof MotifsErrorNotFound).to.eq(true);
      }
    });

    it('should delete a user', async () => {
      const deleted = await repo.delItem(user3.username);
      expect(deleted).to.eq(true);
    });

  });

});
