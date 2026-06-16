import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input.jsx';
import { useAuth } from '../context/useAuth.js';
import api from '../services/api.js';

const initialValues = {
  email: '',
  password: '',
};

function validate(values) {
  const nextErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email.trim()) {
    nextErrors.email = 'Email is required';
  } else if (!emailRegex.test(values.email)) {
    nextErrors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    nextErrors.password = 'Password is required';
  } else if (values.password.length < 6) {
    nextErrors.password = 'Password must be at least 6 characters';
  }

  return nextErrors;
}

function Login() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { data } = await api.post('/auth/login', values);
      const token = data.token;
      const user = data.user;

      if (!token || !user?.role) {
        throw new Error('Invalid login response');
      }

      login({ token, user });
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', {
        replace: true,
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Access your campus complaint dashboard.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-800 mb-4">
            Demo: student@campus.edu / password123 (Student) or admin@campus.edu / password123 (Admin)
          </div>
          <Input
            error={errors.email}
            id="login-email"
            label="Email"
            name="email"
            onChange={handleChange}
            placeholder="student@campus.edu"
            type="email"
            value={values.email}
          />
          <Input
            error={errors.password}
            id="login-password"
            label="Password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            type="password"
            value={values.password}
          />

          {submitError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </p>
          ) : null}

          <button
            className="w-full rounded-md bg-blue-700 px-4 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to CCMS?{' '}
          <Link
            className="font-medium text-blue-700 hover:text-blue-900"
            to="/register"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
