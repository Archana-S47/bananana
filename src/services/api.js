const MOCK_USERS_KEY = 'ccms_mock_users';
const MOCK_DELAY = 300;

function getMockUsers() {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  const defaultUsers = [
    {
      id: 'usr_1',
      name: 'Demo Student',
      email: 'student@campus.edu',
      password: 'password123',
      role: 'student',
    },
    {
      id: 'usr_2',
      name: 'Demo Admin',
      email: 'admin@campus.edu',
      password: 'password123',
      role: 'admin',
    },
  ];
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(defaultUsers));
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

  throw createError(404, 'Not found');
}

function createError(status, message) {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
}

const mockApi = {
  post: mockPost,
  get: async (url) => {
    await delay(MOCK_DELAY);
    if (url === '/auth/me') {
      const token = localStorage.getItem('ccms_token');
      if (!token) throw createError(401, 'Unauthorized');
      const userStr = localStorage.getItem('ccms_user');
      if (!userStr) throw createError(401, 'Unauthorized');
      return { data: { user: JSON.parse(userStr) } };
    }
    throw createError(404, 'Not found');
  },
};

export default mockApi;