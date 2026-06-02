export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white/90 text-slate-600 mt-auto shadow-inner shadow-slate-200/40">
      <div className="container-custom py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr]">
          <div>
            <h3 className="text-[#1E1B4B] font-semibold text-xl mb-3">Short.link</h3>
            <p className="text-sm text-[#374151] max-w-md">
              A polished URL shortening platform with analytics, QR generation, and workflow-ready link management.
            </p>
          </div>

          <div>
            <h4 className="text-[#1E1B4B] font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li><a href="#" className="hover:text-[#4F46E5] transition">Create URL</a></li>
              <li><a href="#" className="hover:text-[#4F46E5] transition">Dashboard</a></li>
              <li><a href="#" className="hover:text-[#4F46E5] transition">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1E1B4B] font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li><a href="#" className="hover:text-[#4F46E5] transition">About</a></li>
              <li><a href="#" className="hover:text-[#4F46E5] transition">Privacy</a></li>
              <li><a href="#" className="hover:text-[#4F46E5] transition">Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1E1B4B] font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li><a href="#" className="hover:text-[#4F46E5] transition">API Docs</a></li>
              <li><a href="#" className="hover:text-[#4F46E5] transition">GitHub</a></li>
              <li><a href="#" className="hover:text-[#4F46E5] transition">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800/90 pt-6 text-center text-sm text-slate-500">
          © {currentYear} Short.link. All rights reserved. Built for modern link management and analytics.
        </div>
      </div>
    </footer>
  );
}
