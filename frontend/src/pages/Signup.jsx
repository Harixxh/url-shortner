import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1E1B4B]">
      <div className="container-custom grid min-h-screen gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.section
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="auth-panel-alt bg-[#EFF6FF] border border-[#E0E7FF]"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-[#4F46E5]">Launch your premium workspace</p>
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E1B4B]">Register with a polished UI</h1>
          <p className="mt-6 max-w-xl text-[#6B7280] leading-8">
            Join a premium link platform built for scalable businesses with a crisp, professional dashboard.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="panel bg-[#F8FAFF] border-[#E0E7FF]">
              <p className="text-sm text-[#6B7280]">Fast onboarding</p>
              <p className="mt-2 text-2xl font-semibold text-[#1E1B4B]">Launch in seconds</p>
            </div>
            <div className="panel bg-[#F8FAFF] border-[#E0E7FF]">
              <p className="text-sm text-[#6B7280]">Professional design</p>
              <p className="mt-2 text-2xl font-semibold text-[#1E1B4B]">High fidelity UI</p>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="glass-card max-w-xl p-8 sm:p-10"
        >
          <div className="mb-8 space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-[#4F46E5]">Create account</p>
            <h2 className="text-3xl font-semibold text-[#1E1B4B]">Start shortening smarter</h2>
            <p className="text-[#6B7280]">Join now and manage links with stunning analytics and modern UI.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#475569]">Full name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="input-field mt-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#475569]">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="input-field mt-3"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#475569]">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="input-field mt-3"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#475569]">Confirm password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                className="input-field mt-3"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B7280]">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-[#4F46E5] hover:text-[#4338CA]"
            >
              Sign in
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
