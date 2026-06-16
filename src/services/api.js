const MOCK_USERS_KEY = 'ccms_mock_users';
const MOCK_COMPLAINTS_KEY = 'ccms_mock_complaints';
const MOCK_DELAY = 300;

// Import initial dummy data for seeding if needed
import { studentComplaints } from '../data/dummyData';

function getMockComplaints() {
  const stored = localStorage.getItem(MOCK_COMPLAINTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with dummy data if none exists
  localStorage.setItem(MOCK_COMPLAINTS_KEY, JSON.stringify(studentComplaints));
  return studentComplaints;
}

function saveMockComplaints(complaints) {
  localStorage.setItem(MOCK_COMPLAINTS_KEY, JSON.stringify(complaints));
}

function getMockUsers() {
// ... existing getMockUsers ...
  return defaultUsers;
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function generateToken() {
  return 'mock_jwt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mockPost(url, data) {
  await delay(MOCK_DELAY);

  if (url === '/auth/login') {
    const users = getMockUsers();
    const user = users.find(u => u.email === data.email && u.password === data.password);
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }
    const { password, ...userWithoutPassword } = user;
    return { data: { token: generateToken(), user: userWithoutPassword } };
  }

  if (url === '/auth/register') {
    const users = getMockUsers();
    if (users.some(u => u.email === data.email)) {
      throw createError(409, 'Email already registered');
    }
    const newUser = {
      id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };
    users.push(newUser);
    saveMockUsers(users);
    const { password, ...userWithoutPassword } = newUser;
    return { data: { token: generateToken(), user: userWithoutPassword } };
  }

  if (url === '/complaints') {
    const complaints = getMockComplaints();
    const newComplaint = {
      ...data,
      id: 'CMP-' + Math.floor(1000 + Math.random() * 9000),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    complaints.unshift(newComplaint);
    saveMockComplaints(complaints);
    return { data: newComplaint };
  }

  throw createError(404, 'Not found');
}

async function mockPut(url, data) {
  await delay(MOCK_DELAY);
  
  if (url.startsWith('/complaints/')) {
    const id = url.split('/').pop();
    const complaints = getMockComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) throw createError(404, 'Complaint not found');
    
    complaints[index] = { ...complaints[index], ...data };
    saveMockComplaints(complaints);
    return { data: complaints[index] };
  }
  
  throw createError(404, 'Not found');
}

async function mockDelete(url) {
  await delay(MOCK_DELAY);
  
  if (url.startsWith('/complaints/')) {
    const id = url.split('/').pop();
    const complaints = getMockComplaints();
    const filtered = complaints.filter(c => c.id !== id);
    saveMockComplaints(filtered);
    return { data: { success: true } };
  }
  
  throw createError(404, 'Not found');
}

function createError(status, message) {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
}

const mockApi = {
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
  get: async (url) => {
    await delay(MOCK_DELAY);
    
    if (url === '/auth/me') {
      const token = localStorage.getItem('ccms_token');
      if (!token) throw createError(401, 'Unauthorized');
      const userStr = localStorage.getItem('ccms_user');
      if (!userStr) throw createError(401, 'Unauthorized');
      return { data: { user: JSON.parse(userStr) } };
    }
    
    if (url === '/complaints') {
      return { data: getMockComplaints() };
    }
    
    if (url.startsWith('/complaints/')) {
      const id = url.split('/').pop();
      const complaints = getMockComplaints();
      const complaint = complaints.find(c => c.id === id);
      if (!complaint) throw createError(404, 'Complaint not found');
      return { data: complaint };
    }
    
    throw createError(404, 'Not found');
  },
};

export default mockApi;