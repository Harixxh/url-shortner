import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUrlStore } from '../store/urlStore';
import toast from 'react-hot-toast';
import { Copy, QrCode, Eye, Trash2 } from 'lucide-react';

export default function MyUrls() {
  const navigate = useNavigate();
  const { urls, pagination, getUrls, deleteUrl, incrementClickCount, loading } = useUrlStore();
  const [page, setPage] = useState(1);
  const [showQrModal, setShowQrModal] = useState(null);

  const handleShortUrlClick = async (e, url) => {
    // Optimistically update UI, let the browser open the link in a new tab
    // (anchor now has target="_blank"). Avoid preventing default to let
    // native new-tab behavior occur and keep this tab available to refetch.
    incrementClickCount(url._id);

    setTimeout(async () => {
      try {
        await getUrls(page, 10);
      } catch (err) {
        console.error('Failed to refetch URLs:', err);
      }
    }, 500);
  };

  useEffect(() => {
    getUrls(page, 10).catch(() => toast.error('Failed to load URLs'));
  }, [page]);

  useEffect(() => {
    const handleFocus = () => {
      getUrls(page, 10).catch(() => {});
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [page]);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const handleDelete = async (urlId) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        await deleteUrl(urlId);
        toast.success('URL deleted successfully');
      } catch {
        toast.error('Failed to delete URL');
      }
    }
  };

  return (
    <div className="container-custom py-10">
      <div className="section-heading pb-6 border-b border-[#E0E7FF] mb-8">
        <div>
          <p className="badge-soft">Your links</p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1E1B4B]">Manage your URL collection</h1>
          <p className="mt-4 max-w-3xl text-lg text-[#6B7280]">Review, copy, and analyze each short link from your custom workspace.</p>
        </div>
        <button onClick={() => navigate('/create')} className="btn-primary">
          + Create New URL
        </button>
      </div>

      {urls.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {urls.map((url) => (
            <article key={url._id} className="link-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">{url.customAlias ? 'Custom alias' : 'Short code'}</p>
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleShortUrlClick(e, url)}
                    className="mt-3 block text-xl font-semibold text-[#1E1B4B] hover:text-[#4338CA]"
                  >
                    {url.customAlias || url.shortCode}
                  </a>
                  <p className="mt-2 text-[#6B7280] truncate">{url.shortUrl}</p>
                </div>
                <div className="rounded-full bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#1E1B4B]">
                  {url.clickCount.toLocaleString()} clicks
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-4 border border-[#E0E7FF]">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#6B7280]">Original URL</p>
                  <p className="mt-2 text-sm text-[#6B7280] truncate">{url.originalUrl}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 border border-[#E0E7FF]">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#6B7280]">Created</p>
                  <p className="mt-2 text-sm text-[#6B7280]">{new Date(url.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => handleCopyUrl(url.shortUrl)} className="btn-muted">
                  Copy
                </button>
                <button onClick={() => setShowQrModal(url)} className="btn-secondary">
                  QR Code
                </button>
                <button onClick={() => navigate(`/analytics/${url._id}`)} className="btn-primary">
                  Analytics
                </button>
                <button onClick={() => handleDelete(url._id)} className="btn-danger">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : !loading ? (
        <div className="analytics-card text-center">
          <p className="text-xl font-semibold text-[#1E1B4B]">No URLs created yet</p>
          <p className="mt-3 text-[#6B7280]">Your short links will show here as polished cards with quick actions.</p>
          <button onClick={() => navigate('/create')} className="btn-primary mt-6">
            Create your first URL
          </button>
        </div>
      ) : null}

      {pagination.total > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-8">
          <p className="text-sm text-[#6B7280]">Page {page} of {pagination.total} · {pagination.totalCount} URLs</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn-muted min-w-[3rem]"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.total}
              className="btn-muted min-w-[3rem]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#E0E7FF]/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-[#E0E7FF] bg-white p-8 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-[#1E1B4B]">QR Code</h3>
                <p className="text-sm text-[#6B7280]">Scan to visit the short link instantly.</p>
              </div>
              <button onClick={() => setShowQrModal(null)} className="text-[#6B7280] hover:text-[#1E1B4B]">✕</button>
            </div>
            <div className="rounded-[2rem] bg-[#F8FAFF] p-6 border border-[#E0E7FF]">
              <img src={showQrModal.qrCodeUrl} alt="QR Code" className="mx-auto w-full max-w-xs" />
              <p className="mt-6 text-sm text-[#6B7280] break-words text-center">{showQrModal.shortUrl}</p>
            </div>
            <button onClick={() => setShowQrModal(null)} className="btn-secondary mt-6 w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
