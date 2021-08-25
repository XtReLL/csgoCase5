import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'app.module';
import * as request from 'supertest';
import { UserFactory } from 'user/user/factories/user.factory';

import * as decorator from './authorized.decorator';

describe('Authorized decorator', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  const getSelfProfile = `
  query getUser {
  user {
      id
  }
}`;

  describe('standard client', () => {
    test('correct get', async () => {
      const user = await UserFactory().create();

      return request(app.getHttpServer())
        .post('/graphql')
        .set('role', 'client')
        .set('login', `${user.id}`)
        .send({
          operationName: 'getUser',
          query: getSelfProfile,
        })
        .expect(({ body }) => {
          const responseUser = body.data.user;
          expect(responseUser.id).toEqual(`${user.id}`);
        });
    });

    test('non-auth', async () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          operationName: 'getUser',
          query: getSelfProfile,
        })
        .expect(({ body }) => {
          expect(body.errors).not.toHaveLength(0);
          expect(body.data).toBeNull();
        });
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
