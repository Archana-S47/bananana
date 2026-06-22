import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  updateComplaint,
} from '../controllers/complaintController.js';

const originalMethods = {
  create: Complaint.create,
  find: Complaint.find,
  findById: Complaint.findById,
  deleteOne: Complaint.deleteOne,
};

function mockRes() {
  const res = {
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

  return res;
}

function mockComplaint(overrides = {}) {
  const id = overrides._id || new mongoose.Types.ObjectId();
  const createdBy =
    overrides.createdBy || {
      _id: new mongoose.Types.ObjectId(),
      name: 'Jane Student',
      email: 'jane@example.com',
      role: 'student',
      toString() {
        return this._id.toString();
      },
    };

  return {
    _id: id,
    title: 'Broken light',
    category: 'Facilities',
    description: 'Light is broken in room 204',
    location: 'Room 204',
    status: 'pending',
    createdBy,
    createdDate: new Date('2026-06-22T10:00:00.000Z'),
    save: async function save() {
      return this;
    },
    populate: async function populate() {
      return this;
    },
    ...overrides,
  };
}

function restoreModelStubs() {
  Complaint.create = originalMethods.create;
  Complaint.find = originalMethods.find;
  Complaint.findById = originalMethods.findById;
  Complaint.deleteOne = originalMethods.deleteOne;
}

test.beforeEach(() => {
  restoreModelStubs();
});

test.after(() => {
  restoreModelStubs();
});

test('POST /complaints creates a complaint for the authenticated creator', async () => {
  const req = {
    user: { id: new mongoose.Types.ObjectId().toString(), role: 'student' },
    body: {
      title: 'Broken projector',
      category: 'IT Infrastructure',
      description: 'Projector not turning on',
      location: 'Lab 3',
    },
  };
  const res = mockRes();
  let capturedPayload;

  Complaint.create = async (payload) => {
    capturedPayload = payload;
    return mockComplaint({
      title: payload.title,
      category: payload.category,
      description: payload.description,
      location: payload.location,
      createdBy: {
        _id: req.user.id,
        name: 'Jane Student',
        email: 'jane@example.com',
        role: 'student',
        toString() {
          return this._id.toString();
        },
      },
      populate: async function populate() {
        return this;
      },
    });
  };

  await createComplaint(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.title, 'Broken projector');
  assert.equal(capturedPayload.createdBy, req.user.id);
  assert.equal(res.body.status, 'pending');
});

test('GET /complaints returns complaint list', async () => {
  const req = { user: { id: 'user-1', role: 'student' } };
  const res = mockRes();
  const complaints = [mockComplaint(), mockComplaint({ title: 'Leaking pipe' })];

  Complaint.find = () => ({
    sort: () => ({
      populate: async () => complaints,
    }),
  });

  await getComplaints(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(Array.isArray(res.body), true);
  assert.equal(res.body.length, 2);
  assert.equal(res.body[0].title, 'Broken light');
});

test('PUT /complaints/:id allows creator to edit pending complaint', async () => {
  const creatorId = new mongoose.Types.ObjectId().toString();
  const complaint = mockComplaint({
    createdBy: {
      _id: creatorId,
      name: 'Jane Student',
      email: 'jane@example.com',
      role: 'student',
      toString() {
        return this._id.toString();
      },
    },
  });
  const req = {
    user: { id: creatorId, role: 'student' },
    params: { id: complaint._id.toString() },
    body: { title: 'Fixed title' },
  };
  const res = mockRes();

  Complaint.findById = () => ({
    populate: async () => complaint,
  });

  await updateComplaint(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.title, 'Fixed title');
});

test('PUT /complaints/:id rejects non-creators', async () => {
  const complaint = mockComplaint();
  const req = {
    user: { id: new mongoose.Types.ObjectId().toString(), role: 'student' },
    params: { id: complaint._id.toString() },
    body: { title: 'Unauthorized edit' },
  };
  const res = mockRes();

  Complaint.findById = () => ({
    populate: async () => complaint,
  });

  await updateComplaint(req, res);

  assert.equal(res.statusCode, 403);
  assert.match(res.body.message, /Not authorized/i);
});

test('PUT /complaints/:id only allows pending complaints', async () => {
  const creatorId = new mongoose.Types.ObjectId().toString();
  const complaint = mockComplaint({
    status: 'resolved',
    createdBy: {
      _id: creatorId,
      name: 'Jane Student',
      email: 'jane@example.com',
      role: 'student',
      toString() {
        return this._id.toString();
      },
    },
  });
  const req = {
    user: { id: creatorId, role: 'student' },
    params: { id: complaint._id.toString() },
    body: { title: 'Attempted edit' },
  };
  const res = mockRes();

  Complaint.findById = () => ({
    populate: async () => complaint,
  });

  await updateComplaint(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /Only pending complaints can be edited/i);
});

test('DELETE /complaints/:id allows creator to delete', async () => {
  const creatorId = new mongoose.Types.ObjectId().toString();
  const complaint = mockComplaint({
    createdBy: {
      _id: creatorId,
      name: 'Jane Student',
      email: 'jane@example.com',
      role: 'student',
      toString() {
        return this._id.toString();
      },
    },
  });
  const req = {
    user: { id: creatorId, role: 'student' },
    params: { id: complaint._id.toString() },
  };
  const res = mockRes();
  let deletedFilter;

  Complaint.findById = () => ({
    populate: async () => complaint,
  });
  Complaint.deleteOne = async (filter) => {
    deletedFilter = filter;
    return { deletedCount: 1 };
  };

  await deleteComplaint(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(deletedFilter._id.toString(), complaint._id.toString());
});

test('DELETE /complaints/:id rejects non-creators', async () => {
  const complaint = mockComplaint();
  const req = {
    user: { id: new mongoose.Types.ObjectId().toString(), role: 'student' },
    params: { id: complaint._id.toString() },
  };
  const res = mockRes();

  Complaint.findById = () => ({
    populate: async () => complaint,
  });

  await deleteComplaint(req, res);

  assert.equal(res.statusCode, 403);
  assert.match(res.body.message, /Not authorized/i);
});

test('Authentication is required', async () => {
  const req = { headers: {} };
  const res = mockRes();
  let nextCalled = false;

  await protect(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('Invalid complaint ID is handled', async () => {
  const req = {
    user: { id: new mongoose.Types.ObjectId().toString(), role: 'student' },
    params: { id: 'not-a-valid-object-id' },
  };
  const res = mockRes();

  await getComplaintById(req, res);

  assert.equal(res.statusCode, 404);
  assert.match(res.body.message, /Complaint not found/i);
});

test('Legacy student/open complaints still resolve for owners', async () => {
  const ownerId = new mongoose.Types.ObjectId().toString();
  const complaint = mockComplaint({
    status: 'open',
    createdBy: undefined,
    student: {
      _id: ownerId,
      name: 'Legacy Student',
      email: 'legacy@example.com',
      role: 'student',
      toString() {
        return this._id.toString();
      },
    },
  });
  const req = {
    user: { id: ownerId, role: 'student' },
    params: { id: complaint._id.toString() },
  };
  const res = mockRes();

  Complaint.findById = () => ({
    populate: async () => complaint,
  });

  await getComplaintById(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'pending');
  assert.equal(res.body.student, ownerId);
  assert.equal(res.body.studentName, 'Legacy Student');
});
