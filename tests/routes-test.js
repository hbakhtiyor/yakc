'use strict'

const app = require('../app');
const mongoose = require('mongoose');
const request = require('supertest');
const Post = require('../src/models/Post');

const endpoint = '/posts/';
const validId = '000000000000000000000000';
const invalidId = '1';

let post1, post2, token;

beforeEach(async () => {
  post1 = new Post({title: 'Post Title 1', body: 'Post Body 1'});
  post2 = new Post({title: 'Post Title 2', body: 'Post Body 2'});

  await post1.save();
  await post2.save();

  const {body} = await request(app)
    .post('/login')
    .send({password: 'password'})
    .set('Accept', 'application/json')
    .expect(200);

  token = body.token;
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await app.close();
});

describe('routes: posts', () => {
  describe('routes: get posts', () => {
    it('should respond all posts', async () => {
      await request(app)
        .get(endpoint)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(2);
          expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({title: post1.title, body: post1.body}),
              expect.objectContaining({title: post2.title, body: post2.body})
            ])
          );
        });
    });
  });

  describe('routes: get a post', () => {
    it ('should respond a post', async () => {
      await request(app)
        .get(endpoint + post1._id)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            expect.objectContaining({title: post1.title, body: post1.body})
          );
        });
    });

    it ('should respond not found with unavailable post', async () => {
      await request(app)
        .get(endpoint + validId)
        .expect(404);
    });

    it ('should respond bad request with invalid id', async () => {
      await request(app)
        .get(endpoint + invalidId)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect({message: 'ID should be valid'})
        .expect(400);
    });
  });

  describe('routes: delete a post', () => {
    it ('should delete a post with auth', async () => {
      await request(app)
        .delete(endpoint + post1._id)
        .set('Authorization', 'Bearer ' + token)
        .expect(204);
    });

    it ('should respond not found when deleting an available post with auth', async () => {
      await request(app)
        .delete(endpoint + validId)
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });

    it ('should not delete a post without auth', async () => {
      await request(app)
        .delete(endpoint + post1._id)
        .expect(401);
    });

    it ('should not delete an unavailable post without auth', async () => {
      await request(app)
        .delete(endpoint + validId)
        .expect(401);
    })

    it ('should respond bad request with invalid id', async () => {
      await request(app)
        .delete(endpoint + invalidId)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect({message: 'ID should be valid'})
        .expect(400);
    });
  });

  describe('routes: put a post', () => {
    it ('should update a post with auth', async () => {
      const post = {title: 'Updated Post Title 1', body: 'Updated Post Body 1'};
      await request(app)
        .put(endpoint + post1._id)
        .send(post)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(204);

        // @fix maybe bug in the koa-bodyparser, response body is empty
        // .then(response => {
        //   expect(response.body).toEqual(
        //     expect.objectContaining(post)
        //   );
        // });
    });

    it ('should respond not found when updating an unavailable post with auth', async () => {
      await request(app)
        .put(endpoint + validId)
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });

    it ('should not update a post without auth', async () => {
      await request(app)
        .put(endpoint + post1._id)
        .expect(401);
    });

    it ('should not update an unavailable post without auth', async () => {
      await request(app)
        .put(endpoint + validId)
        .expect(401);
    })

    it ('should respond bad request with invalid id', async () => {
      await request(app)
        .put(endpoint + invalidId)
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect({message: 'ID should be valid'})
        .expect(400);
    });
  });

  describe('routes: create a post', () => {
    it ('should create a post with auth', async () => {
      const post = {title: 'Post Title 3', body: 'Post Body 3'};
      await request(app)
        .post(endpoint)
        .send(post)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(201)
        .then(response => {
          expect(response.body).toEqual(
            expect.objectContaining(post)
          );
        });
    });

    it ('should not create an post without body and with auth', async () => {
      await request(app)
        .post(endpoint)
        .send({title: 'Post Title 3'})
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect({message: 'Validation Failed'})
        .expect(422);
    });

    it ('should not create an post without title and with auth', async () => {
      await request(app)
        .post(endpoint)
        .send({body: 'Post Body 3'})
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect({message: 'Validation Failed'})
        .expect(422);
    });

    it ('should not create an incomplete post with auth', async () => {
      await request(app)
        .post(endpoint)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect({message: 'Validation Failed'})
        .expect(422);
    });

    it ('should not create a post without auth', async () => {
      await request(app)
        .post(endpoint)
        .send({title: 'Post Title 3', body: 'Post Body 3'})
        .set('Accept', 'application/json')
        .expect(401);
    });
  });
});
