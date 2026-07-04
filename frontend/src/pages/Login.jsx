import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanLine, ArrowLeft, Mail, Lock } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import './AuthLayout.css';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      e.password = 'Enter your password.';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // Pass remember option
      await login(form.email, form.password, remember);

      showToast('Welcome back!', 'success');

      navigate('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-glow" />

        <Link to="/" className="auth-side-logo">
          <ScanLine size={22} />
          <span>
            LogicLens <em>AI</em>
          </span>
        </Link>

        <div className="auth-side-quote">
          <p>
            "Bug density dropped from 1 issue per 20 lines to 1 per 35."
            Keep that streak going.
          </p>

          <span>
            Track your progress, review after review.
          </span>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-form-back">
            <ArrowLeft size={14} />
            Back to Home
          </Link>

          <h2>Welcome Back</h2>

          <p className="auth-form-sub">
            Log in to continue using LogicLens AI.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              required
              error={errors.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              value={form.password}
              required
              error={errors.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <div className="auth-form-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(e.target.checked)
                  }
                />

                Remember me
              </label>

              <Link
                to="/forgot-password"
                style={{
                  color: 'var(--signal)',
                  fontWeight: 600,
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              full
              size="lg"
              loading={loading}
            >
              Log In
            </Button>
          </form>

          <p className="auth-form-footer">
            New to LogicLens?{' '}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}