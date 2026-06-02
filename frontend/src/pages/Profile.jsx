import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, me, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        try {
          const profile = await me();
          setFormData({ name: profile.name || '', email: profile.email || '', password: '' });
        } catch (error) {
          toast.error('Unable to load profile');
        }
        return;
      }
      setFormData({ name: user.name || '', email: user.email || '', password: '' });
    };

    loadProfile();
  }, [me, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined
      });
      toast.success('Profile updated successfully');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E0E7FF]">
        <div className="bg-[#ECFDF5] px-8 py-10">
          <h1 className="text-3xl font-semibold text-[#1E293B]">Your Profile</h1>
          <p className="mt-3 text-[#475569] max-w-2xl">
            Update your account details, change your password, and keep your profile information fresh.
          </p>
        </div>

        <div className="p-8 sm:p-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-[#E0E7FF] bg-[#F8FAFF] p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#1E1B4B]">Profile details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-2">Email address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] mb-2">New password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    placeholder="Leave blank to keep current password"
                  />
                  <p className="text-sm text-[#6B7280] mt-2">Password must be at least 6 characters if you choose to update it.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? 'Saving profile...' : 'Save changes'}
                </button>
              </form>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#E0E7FF] bg-[#F8FAFF] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-[#6B7280]">Account summary</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#E0E7FF]">
                  <p className="text-sm text-[#6B7280]">Name</p>
                  <p className="mt-2 font-semibold text-[#1E1B4B]">{user?.name || 'N/A'}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#E0E7FF]">
                  <p className="text-sm text-[#6B7280]">Email</p>
                  <p className="mt-2 font-semibold text-[#1E1B4B]">{user?.email || 'N/A'}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-[#E0E7FF]">
                  <p className="text-sm text-[#6B7280]">Member since</p>
                  <p className="mt-2 font-semibold text-[#1E1B4B]">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E0E7FF] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1E1B4B]">Profile tips</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#475569]">
                <li>Use a professional email address.</li>
                <li>Keep your password secure and update it regularly.</li>
                <li>Make sure your name is spelled correctly.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
