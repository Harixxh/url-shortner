import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUrlStore } from '../store/urlStore';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';

export default function CreateUrl() {
  const navigate = useNavigate();
  const { createUrl, loading } = useUrlStore();
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expiryDate: '',
    metadata: { title: '', description: '' }
  });
  const [createdUrl, setCreatedUrl] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.originalUrl.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(formData.originalUrl);
    } catch {
      toast.error('Invalid URL format');
      return;
    }

    if (formData.customAlias) {
      if (formData.customAlias.length < 3) {
        toast.error('Alias must be at least 3 characters');
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(formData.customAlias)) {
        toast.error('Alias can only contain alphanumeric characters, dash, and underscore');
        return;
      }
    }

    try {
      const result = await createUrl({
        originalUrl: formData.originalUrl,
        customAlias: formData.customAlias || undefined,
        expiryDate: formData.expiryDate || undefined,
        metadata: formData.metadata.title || formData.metadata.description ? formData.metadata : undefined
      });

      setCreatedUrl(result);
      setFormData({ originalUrl: '', customAlias: '', expiryDate: '', metadata: { title: '', description: '' } });
      toast.success('Short link created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create short URL');
    }
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  };

  const previewUrl = createdUrl?.shortUrl || `https://short.link/${formData.customAlias || 'preview'}`;

  return (
    <div className="container-custom py-10">
      <div className="section-heading pb-6 border-b border-[#E0E7FF] mb-8">
        <p className="badge-soft">Create Link</p>
        <h1 className="mt-4 text-5xl font-semibold text-[#1E1B4B]">Build a smarter URL experience.</h1>
        <p className="mt-4 max-w-3xl text-xl text-[#6B7280] leading-8">
          Create a branded short link, attach metadata, and preview the live output before sharing.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit} className="analytics-card space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[#1E1B4B]">Short URL Builder</h2>
              <p className="mt-2 text-[#6B7280]">Enter your destination and customize the short link experience.</p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="btn-muted"
            >
              {expanded ? 'Hide advanced' : 'Show advanced'}
            </button>
          </div>

          <div className="space-y-5">
            <label className="field-label">Destination URL</label>
            <input
              type="url"
              placeholder="https://example.com/landing-page"
              className="input-field"
              value={formData.originalUrl}
              onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
              required
            />
            <p className="field-help">Use a full URL with http or https to keep links reliable.</p>
          </div>

          <div className="space-y-5">
            <label className="field-label">Custom alias</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="inline-flex items-center rounded-2xl bg-[#F8FAFF] px-4 py-3 text-[#6B7280]">short.link/</span>
              <input
                type="text"
                placeholder="brand-name"
                className="input-field flex-1"
                value={formData.customAlias}
                onChange={(e) => setFormData({ ...formData, customAlias: e.target.value })}
              />
            </div>
            <p className="field-help">Optional personalized path for better recall.</p>
          </div>

          {expanded && (
            <div className="space-y-5">
              <div>
                <label className="field-label">Expiry date</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
                <p className="field-help">Auto-expire links when campaigns or events end.</p>
              </div>
              <div>
                <label className="field-label">Title</label>
                <input
                  type="text"
                  placeholder="Spring campaign"
                  className="input-field"
                  value={formData.metadata.title}
                  onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, title: e.target.value } })}
                />
              </div>
              <div>
                <label className="field-label">Description</label>
                <textarea
                  placeholder="Add a short description for previews and link context."
                  className="input-field min-h-[130px] resize-none"
                  value={formData.metadata.description}
                  onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, description: e.target.value } })}
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating...' : 'Create short link'}
            </button>
            <button type="button" onClick={() => navigate('/urls')} className="btn-secondary w-full">
              Manage links
            </button>
          </div>
        </form>

        <aside className="analytics-card space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Live preview</p>
                <h2 className="text-2xl font-semibold text-[#1E1B4B]">Short URL preview</h2>
              </div>
              <span className="badge-soft">Instant feedback</span>
            </div>

            <div className="rounded-[2rem] border border-[#E0E7FF] bg-[#F8FAFF] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Short URL</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-[#1E1B4B]">
                <span className="break-all text-lg font-semibold">{previewUrl}</span>
                <button type="button" onClick={() => handleCopyUrl(previewUrl)} className="btn-muted px-3 py-2">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E0E7FF] bg-[#F8FAFF] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Summary</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl bg-white p-4 shadow-sm border border-[#E0E7FF]">
                <p className="text-xs uppercase tracking-[0.25em] text-[#94A3B8]">URL status</p>
                <p className="mt-2 text-lg font-semibold text-[#1E1B4B]">{createdUrl ? 'Live' : 'Ready to publish'}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm border border-[#E0E7FF]">
                <p className="text-xs uppercase tracking-[0.25em] text-[#94A3B8]">Estimated engagement</p>
                <p className="mt-2 text-lg font-semibold text-[#1E1B4B]">{createdUrl ? `${createdUrl.clickCount || 0} clicks so far` : 'Share instantly'}</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm border border-[#E0E7FF]">
                <p className="text-xs uppercase tracking-[0.25em] text-[#94A3B8]">Campaign quality</p>
                <p className="mt-2 text-lg font-semibold text-[#1E1B4B]">{formData.customAlias ? 'Brand-friendly' : 'Quick launch'}</p>
              </div>
            </div>
          </div>

          {createdUrl ? (
            <div className="rounded-[2rem] border border-[#E0E7FF] bg-[#F8FAFF] p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Created link</p>
                  <h3 className="text-xl font-semibold text-[#1E1B4B]">{createdUrl.customAlias || createdUrl.shortCode}</h3>
                </div>
                <span className="badge-soft">Success</span>
              </div>
              <p className="text-[#6B7280] mb-4">Your link is ready to share and track from the dashboard.</p>
              <button type="button" onClick={() => handleCopyUrl(createdUrl.shortUrl)} className="btn-secondary w-full mb-3">
                Copy URL
              </button>
              <button type="button" onClick={() => navigate(`/analytics/${createdUrl._id}`)} className="btn-primary w-full">
                View analytics
              </button>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-[#E0E7FF] bg-[#F8FAFF] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Ready when you are</p>
              <p className="mt-3 text-[#6B7280]">Use the form to generate a premium URL and share it instantly with customers.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
