import request from 'supertest';
import app from '../../app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import admin from '../../firebaseAdmin';
import { Todos } from './todos.model';

let testUserToken: string | undefined;
let id = '';

beforeAll(async () => {
  console.log('Before all hook executed');
  try {
    await Todos.drop();
  } catch (error) {}
  // Clear authentication state
  await firebase.auth().signOut();

  // Delete existing user if exists
  try {
    await admin.auth().deleteUser('test-user');
  } catch (error) {
    // Ignore error if user doesn't exist
  }

  // Create new test user
  try {
    await admin.auth().createUser({
      uid: 'test-user',
      email: 'test-user@example.com',
      password: 'password',
    });

    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword('test-user@example.com', 'password');
    testUserToken = await userCredential.user?.getIdToken();
  } catch (error) {
    console.error('Error setting up test user:', error);
  }
});

describe('GET /api/v1/todos', () => {
  it('responds with an array of todos', async () => {
    await request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      });
  });
});

describe('POST /api/v1/todos', () => {
  it('responds with an error if the todo is invalid', async () => {
    await request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        content: '',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
      });
  });

  it('responds with an inserted object', async () => {
    await request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        content: 'Learn TypeScript',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        id = response.body._id;
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Learn TypeScript');
        expect(response.body).toHaveProperty('done');
      });
  });
});

describe('GET /api/v1/todos/:id', () => {
  it('responds with a single todo', async () => {
    await request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Learn TypeScript');
        expect(response.body).toHaveProperty('done');
      });
  });

  it('responds with an invalid ObjectId error', async () => {
    await request(app)
      .get('/api/v1/todos/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('responds with a not found error', async () => {
    await request(app)
      .get('/api/v1/todos/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404);
  });
});

describe('PUT /api/v1/todos/:id', () => {
  it('responds with an invalid ObjectId error', async () => {
    await request(app)
      .put('/api/v1/todos/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('responds with a not found error', async () => {
    await request(app)
      .put('/api/v1/todos/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        content: 'Learn TypeScript',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('responds with a single todo', async () => {
    await request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .send({
        content: 'Learn TypeScript',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');
        expect(response.body.done).toBe(true);
      });
  });
});

describe('DELETE /api/v1/todos/:id', () => {
  it('responds with an invalid ObjectId error', async () => {
    await request(app)
      .delete('/api/v1/todos/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .expect('Content-Type', /json/)
      .expect(422);
  });

  it('responds with a not found error', async () => {
    await request(app)
      .delete('/api/v1/todos/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('responds with a 204 status code', async () => {
    await request(app)
      .delete(`/api/v1/todos/${id}`)
      .set('Authorization', `Bearer ${testUserToken}`)
      .expect(204);
  });

  it('responds with a not found error', async () => {
    await request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${testUserToken}`)
      .expect(404);
  });
});
