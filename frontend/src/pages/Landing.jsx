import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#1E1B4B]">
      <div className="container-custom py-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#4F46E5]">Short.link</p>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1E1B4B]">
              Build premium links with powerful analytics.
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary w-full md:w-auto"
            >
              Launch your workspace
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary"
            >
              Sign in
            </button>
          </div>
        </header>
      </div>

      <main className="container-custom grid grid-cols-1 md:grid-cols-2 gap-10 items-start py-16">
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-[#E0E7FF] bg-white p-8 shadow-[0_32px_120px_-70px_rgba(148,163,184,0.16)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#4F46E5]">Enterprise-grade platform</p>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1E1B4B] lg:text-6xl">
              Build faster, launch smarter, and ship beautiful links.
            </h2>
            <p className="mt-6 max-w-2xl text-[#6B7280] leading-8">
              High-performance URL management designed for scalable projects, rapid prototyping, and polished business presentations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="badge badge-success">Fast setup</span>
              <span className="badge badge-warning">Clear analytics</span>
              <span className="badge badge-error">Enterprise polish</span>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Responsive Design</p>
              <p className="mt-2 text-3xl font-semibold text-[#1E1B4B]">High clarity</p>
              <p className="text-sm text-[#6B7280] mt-2">Optimized contrast and responsive layouts for all screen sizes.</p>
            </div>
            <div className="panel">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Production ready</p>
              <p className="mt-2 text-3xl font-semibold text-[#1E1B4B]">Enterprise-grade UI</p>
              <p className="text-sm text-[#6B7280] mt-2">A polished platform built to scale and impress stakeholders.</p>
            </div>
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="glass-card max-w-2xl p-8"
        >
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-[#E0E7FF] bg-[#EFF6FF] p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-[#4F46E5]">Live preview</p>
              <h3 className="mt-4 text-2xl font-semibold text-[#1E1B4B]">Your dashboard, reimagined.</h3>
              <p className="mt-3 text-[#6B7280] leading-7">
                A clean workspace for all your links, complete with daily trends, performance metrics, and quick actions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="panel bg-[#EFF6FF] border-[#E0E7FF]">
                <p className="text-sm text-[#6B7280]">Active Links</p>
                <p className="mt-3 text-3xl font-semibold text-[#1E1B4B]">184</p>
              </div>
              <div className="panel bg-[#EFF6FF] border-[#E0E7FF]">
                <p className="text-sm text-[#6B7280]">Conversion</p>
                <p className="mt-3 text-3xl font-semibold text-[#1E1B4B]">12.4%</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <section className="container-custom pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="panel"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#6B7280]">Quick actions</p>
            <h3 className="mt-4 text-xl font-semibold text-[#1E1B4B]">One-click workflow</h3>
            <p className="mt-3 text-[#6B7280] leading-7">
              Create links, copy short URLs, and share QR codes instantly from a single dashboard.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="panel"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#6B7280]">Insights</p>
            <h3 className="mt-4 text-xl font-semibold text-[#1E1B4B]">Actionable metrics</h3>
            <p className="mt-3 text-[#6B7280] leading-7">
              Track the most important trends quickly with device, browser, and geography breakdowns.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="panel"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#6B7280]">Security</p>
            <h3 className="mt-4 text-xl font-semibold text-[#1E1B4B]">Built for teams</h3>
            <p className="mt-3 text-[#6B7280] leading-7">
              Keep your links protected and easy to manage with a polished interface designed for teams.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
