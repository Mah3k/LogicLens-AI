import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanLine, ArrowLeft, User, Mail, Lock } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import './AuthLayout.css';

function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['#F2607A', '#F2607A', '#F4B860', '#9B7FDB', '#6FD9A6'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const strength = scorePassword(form.password);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.password.length < 8) e.password = 'Use at least 8 characters.';
    if (form.confirm !== form.password) e.confirm = 'Passwords don\u2019t match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      showToast('Account created. Welcome to LogicLens!', 'success');
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
        <Link to="/" className="auth-side-logo"><ScanLine size={22} /><span>LogicLens <em>AI</em></span></Link>
        <div className="auth-side-quote">
          <p>"Your AI review will appear here." Start every commit knowing exactly where it stands.</p>
          <span>Code quality scoring, on every paste.</span>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <Link to="/" className="auth-form-back"><ArrowLeft size={14} /> Back to home</Link>
          <h2>Create your account</h2>
          <p className="auth-form-sub">Start getting AI feedback on your code in minutes.</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <Input label="Full name" icon={User} placeholder="Full Name" value={form.name} required
              onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" value={form.email} required
              onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <div>
              <Input label="Password" type="password" icon={Lock} placeholder="At least 8 characters" value={form.password} required
                onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
              {form.password && (
                <>
                  <div className="strength-bar">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} style={{ background: i < strength ? COLORS[strength] : undefined }} />
                    ))}
                  </div>
                  <p className="strength-label" style={{ color: COLORS[strength] }}>{LABELS[strength]}</p>
                </>
              )}
            </div>
            <Input label="Confirm password" type="password" icon={Lock} placeholder="Re-enter password" value={form.confirm} required
              onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} />

            <Button type="submit" full size="lg" loading={loading}>Create account</Button>
          </form>

          <p className="auth-form-footer">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}
