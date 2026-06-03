import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1E1B4B]">
      <div className="container-custom grid min-h-screen gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <motion.section
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="auth-panel relative overflow-hidden bg-[#EFF6FF] border border-[#E0E7FF]"
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-[#DBEAFE] via-[#EFF6FF] to-transparent blur-3xl" />
          <div className="relative space-y-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#4F46E5]">Short.link dashboard</p>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E1B4B] leading-tight">Sign in to manage your URLs</h1>
              <p className="mt-5 max-w-2xl text-base sm:text-lg md:text-xl text-[#6B7280] leading-9">
                Access your link analytics, shorten URLs, and control your workspace from one polished, professional interface.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel bg-[#F8FAFF] border-[#E0E7FF]">
                <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Custom URLs</p>
                <p className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Create and manage</p>
              </div>
              <div className="panel bg-[#F8FAFF] border-[#E0E7FF]">
                <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Analytics</p>
                <p className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Track every click</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="glass-card w-full p-10"
        >
          <div className="mb-10 space-y-4">
            <div className="rounded-[1.75rem] bg-[#F8FAFF] p-7 shadow-[0_16px_45px_-20px_rgba(15,23,42,0.12)]">
              <p className="text-sm uppercase tracking-[0.28em] text-[#4F46E5]">Sign in</p>
              <h2 className="mt-4 text-4xl font-semibold text-[#1E1B4B]">Welcome back.</h2>
              <p className="mt-3 text-lg text-[#6B7280]">Enter your account details to continue managing your URL suite.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-[#475569]">Email address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="input-field mt-4"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-[#475569]">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input-field mt-4"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-base text-[#6B7280]">
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-semibold text-[#4F46E5] hover:text-[#4338CA]"
            >
              Create one.
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
