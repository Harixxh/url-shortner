import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUrlStore } from '../store/urlStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { Copy, QrCode, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { summary, getDashboardSummary, deleteUrl, incrementClickCount, loading } = useUrlStore();
  const [showQrModal, setShowQrModal] = useState(null);

  const handleShortUrlClick = async (e, url) => {
    // Optimistic UI update; let the browser handle opening in a new tab
    // (anchors now include target="_blank"). Don't prevent default.
    incrementClickCount(url._id);

    setTimeout(async () => {
      try {
        await getDashboardSummary();
      } catch (err) {
        console.error('Failed to refetch dashboard:', err);
      }
    }, 500);
  };

  useEffect(() => {
    getDashboardSummary().catch(() => toast.error('Failed to load dashboard'));
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      getDashboardSummary().catch(() => {});
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const handleDelete = async (urlId) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        await deleteUrl(urlId);
        toast.success('URL deleted successfully');
        getDashboardSummary();
      } catch {
        toast.error('Failed to delete URL');
      }
    }
  };

  const summaryData = summary?.summary || {};
  const recentLinks = summary?.topPerforming || [];
  const chartData = recentLinks.map((url) => ({
    name: url.customAlias || url.shortCode,
    clicks: url.clickCount
  }));
  const monthlyGrowth = summary
    ? `${Math.max(5, Math.round((summaryData.averageClicksPerUrl || 0) * 1.2))}%`
    : '0%';

  return (
    <div className="container-custom py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="section-heading"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="badge-soft">Dashboard</p>
            <h1 className="mt-4 text-5xl font-semibold text-[#1E1B4B]">Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1>
            <p className="mt-4 max-w-3xl text-xl text-[#6B7280] leading-8">
              Your link workspace is ready. Track performance, launch new short URLs, and surface growth insights from one premium hub.
            </p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="btn-primary"
          >
            + Create Smart Link
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="grid gap-6 xl:grid-cols-[1.4fr_0.85fr] mb-8"
      >
        <div className="analytics-card">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Account Summary</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Today’s link performance</h2>
            </div>
            <div className="badge-soft">Active workspace</div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="metric-card">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Total Links</p>
              <p className="mt-4 text-4xl font-bold text-[#1E1B4B]">{summaryData.totalUrls || 0}</p>
              <p className="mt-3 text-[#6B7280]">Links currently active in your account.</p>
            </div>
            <div className="metric-card">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Total Clicks</p>
              <p className="mt-4 text-4xl font-bold text-[#1E1B4B]">{summaryData.totalClicks?.toLocaleString() || 0}</p>
              <p className="mt-3 text-[#6B7280]">Lifetime engagement across your links.</p>
            </div>
            <div className="metric-card">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Active Links</p>
              <p className="mt-4 text-4xl font-bold text-[#1E1B4B]">{summaryData.totalUrls || 0}</p>
              <p className="mt-3 text-[#6B7280]">Live shortened URLs in your account.</p>
            </div>
            <div className="metric-card">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">QR Codes</p>
              <p className="mt-4 text-4xl font-bold text-[#1E1B4B]">{summaryData.totalUrls || 0}</p>
              <p className="mt-3 text-[#6B7280]">Automatically generated for each link.</p>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Recent Activity</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Live updates</h2>
            </div>
            <div className="badge-soft">{monthlyGrowth} growth</div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[1.75rem] bg-[#F8FAFF] p-6 border border-[#E0E7FF]">
              <p className="text-sm uppercase tracking-[0.25em] text-[#6B7280]">Most Recent Click</p>
              <p className="mt-3 text-2xl font-semibold text-[#1E1B4B]">{summaryData.mostRecentClick ? new Date(summaryData.mostRecentClick).toLocaleString() : 'No clicks yet'}</p>
              <p className="mt-2 text-[#6B7280]">Share your new links to generate the first click.</p>
            </div>
            <div className="rounded-[1.75rem] bg-[#F8FAFF] p-6 border border-[#E0E7FF]">
              <p className="text-sm uppercase tracking-[0.25em] text-[#6B7280]">Top URL</p>
              <p className="mt-3 text-2xl font-semibold text-[#1E1B4B]">{recentLinks[0]?.customAlias || recentLinks[0]?.shortCode || 'No top link yet'}</p>
              <p className="mt-2 text-[#6B7280]">Your highest performing short link over time.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr] mb-8"
      >
        <div className="analytics-card">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Insights</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Traffic trends</h2>
            </div>
            <span className="badge-soft">Top links</span>
          </div>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E0E7FF' }} labelStyle={{ color: '#1E1B4B' }} itemStyle={{ color: '#1E1B4B' }} />
                  <Line type="monotone" dataKey="clicks" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[1.75rem] bg-[#F8FAFF] text-[#6B7280]">
                No chart data available yet.
              </div>
            )}
          </div>
        </div>

        <div className="analytics-card">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Top Performing Links</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Best conversions</h2>
            </div>
            <span className="badge-soft">Top 5</span>
          </div>
          <div className="space-y-4">
            {recentLinks.slice(0, 5).map((url) => (
              <div key={url._id} className="rounded-[1.75rem] bg-[#F8FAFF] p-4 border border-[#E0E7FF]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleShortUrlClick(e, url)}
                      className="text-lg font-semibold text-[#1E1B4B] hover:text-[#4338CA]"
                    >
                      {url.customAlias || url.shortCode}
                    </a>
                    <p className="text-sm text-[#6B7280] mt-1 truncate">{url.shortUrl}</p>
                  </div>
                  <div className="rounded-full bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-[#1E1B4B]">
                    {url.clickCount} clicks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="analytics-card">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">AI Insights</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Growth intelligence</h2>
            </div>
            <span className="badge-soft">Actionable</span>
          </div>
          <div className="rounded-[1.75rem] bg-[#F8FAFF] p-6 border border-[#E0E7FF]">
            <p className="text-lg font-semibold text-[#1E1B4B]">Your custom short links attract more clicks.</p>
            <p className="mt-4 text-[#6B7280] leading-7">
              Links with branded aliases see higher engagement, and QR-enabled URLs are the fastest way to share across devices.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 border border-[#E0E7FF]">
                <p className="text-sm uppercase tracking-[0.25em] text-[#6B7280]">Best performing category</p>
                <p className="mt-3 text-xl font-semibold text-[#1E1B4B]">Branded links</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-[#E0E7FF]">
                <p className="text-sm uppercase tracking-[0.25em] text-[#6B7280]">Engagement lift</p>
                <p className="mt-3 text-xl font-semibold text-[#1E1B4B]">+18% over average</p>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Recent Links</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#1E1B4B]">Modern link cards</h2>
            </div>
            <button
              onClick={() => navigate('/urls')}
              className="btn-secondary"
            >
              View all links
            </button>
          </div>
          <div className="grid gap-4">
            {recentLinks.length > 0 ? recentLinks.slice(0, 4).map((url) => (
              <div key={url._id} className="link-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">{url.customAlias ? 'Custom Alias' : 'Short Code'}</p>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleShortUrlClick(e, url)}
                      className="mt-2 block text-lg font-semibold text-[#1E1B4B] hover:text-[#4338CA]"
                    >
                      {url.customAlias || url.shortCode}
                    </a>
                  </div>
                  <span className="badge-soft">{url.clickCount} clicks</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#6B7280]">Short URL</p>
                    <p className="mt-2 text-sm text-[#6B7280] truncate">{url.shortUrl}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#6B7280]">Created</p>
                    <p className="mt-2 text-sm text-[#6B7280]">{new Date(url.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCopyUrl(url.shortUrl)}
                    className="btn-muted"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => navigate(`/analytics/${url._id}`)}
                    className="btn-secondary"
                  >
                    Analytics
                  </button>
                  <button
                    onClick={() => handleDelete(url._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <p className="text-lg font-semibold text-[#1E1B4B]">Create your first smart link</p>
                <p className="mt-3 text-[#6B7280]">Your links will show here as premium cards with quick actions and analytics.</p>
                <button
                  onClick={() => navigate('/create')}
                  className="btn-primary mt-6"
                >
                  Start creating links
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
