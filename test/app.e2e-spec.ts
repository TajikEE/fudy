import { HttpStatus } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';

describe('User and Auth modules (e2e)', () => {
  const randomEmail = `${Math.random()
    .toString(36)
    .substring(2, 15)}@example.com`;
  const mockUser = {
    email: randomEmail,
    password: 'Asdqwe1@',
  };

  describe('/users (POST)', () => {
    const userUrl = `http://localhost:4005/users/`;
    it('it should create a user and return id, statusCode, email ', () => {
      return request(userUrl)
        .post('')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect((response: request.Response) => {
          const { id, statusCode, email } = response.body;

          expect(typeof statusCode).toBe('number'),
            expect(typeof id).toBe('number'),
            expect(statusCode).toEqual(201),
            expect(email).toEqual(mockUser.email);
        })
        .expect(HttpStatus.CREATED);
    });
  });

  describe('/auth/login (POST)', () => {
    const authUrl = `http://localhost:4005/auth/`;
    it('it should login a user and return a token, statusCode', () => {
      return request(authUrl)
        .post('login')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect((response: request.Response) => {
          const { token, statusCode } = response.body;

          expect(typeof statusCode).toBe('number'),
            expect(statusCode).toEqual(201),
            expect(token).toBeDefined();
        })
        .expect(HttpStatus.CREATED);
    });
  });
});
