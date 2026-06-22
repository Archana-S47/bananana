import test from 'node:test';
import assert from 'node:assert/strict';
import { me } from '../controllers/authController.js';

function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test('GET /auth/me returns the current user payload', async () => {
  const req = {
    user: {
      _id: 'user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'student',
    },
  };
  const res = mockRes();

  await me(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.user, {
    id: 'user-123',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'student',
  });
});
