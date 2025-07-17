import React, { useRef, useState } from 'react';

export default function WaitlistModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', usecase: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company || !form.usecase) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSuccess(true);
    setForm({ name: '', email: '', company: '', usecase: '' });
    // Removed auto-close logic to keep modal open until user clicks the cross button
  };

  return (
    <div ref={modalRef} onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#232946]/90 to-[#181F2A]/90 rounded-3xl shadow-2xl w-full max-w-sm p-6 relative max-h-[90vh] overflow-y-auto flex flex-col border border-white/10 backdrop-blur-xl" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'}}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-300 hover:text-white text-3xl bg-white/10 hover:bg-white/20 rounded-full p-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
          &times;
        </button>
        <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg text-center">Request Early Access</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Name</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm backdrop-blur-md" placeholder="Your Name" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm backdrop-blur-md" placeholder="you@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Company</label>
            <input name="company" type="text" value={form.company} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm backdrop-blur-md" placeholder="Company Name" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Use Case</label>
            <textarea name="usecase" value={form.usecase} onChange={handleChange} className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm backdrop-blur-md" rows={3} placeholder="Tell us how you plan to use AnkFin..." required />
          </div>
          <button type="submit" disabled={loading} className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:from-blue-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-60 tracking-wide">
            {loading ? 'Sending...' : 'Request Access'}
          </button>
          {success && (
            <div className="text-green-400 text-center mt-4">
              Request sent! We'll be in touch.
              <div className="mt-4">
                <span className="block text-gray-300 mb-2 text-base">Share with others:</span>
                <div className="flex justify-center gap-4 mb-6">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=Join%20the%20Ankfin%20waitlist!%20AI-powered%20finance%20in%20your%20pocket%20-%20${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on WhatsApp"
                    className="hover:scale-110 transition-transform"
                  >
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-green-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374A9.86 9.86 0 012.1 12.045C2.073 6.507 6.659 1.92 12.199 1.92c2.637 0 5.112 1.027 6.988 2.893a9.825 9.825 0 012.893 6.977c-.003 5.539-4.589 10.126-10.029 10.126m8.413-18.413A11.815 11.815 0 0012.2 0C5.452 0 .077 5.373.1 12.021c.021 2.13.557 4.21 1.611 6.077L.057 24l6.084-1.616a11.888 11.888 0 005.429 1.378h.005c6.748 0 12.124-5.373 12.147-12.021a11.82 11.82 0 00-3.48-8.372"/></svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                    className="hover:scale-110 transition-transform"
                  >
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-blue-500"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                  </a>
                  {/* Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=Join%20the%20Ankfin%20waitlist!%20AI-powered%20finance%20in%20your%20pocket%20-%20${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Twitter"
                    className="hover:scale-110 transition-transform"
                  >
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-blue-400"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 00-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 01-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 007.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z"/></svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Facebook"
                    className="hover:scale-110 transition-transform"
                  >
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-blue-700"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.324-1.326z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a
                    href={`https://www.instagram.com/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Instagram"
                    className="hover:scale-110 transition-transform"
                  >
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24" className="text-pink-500"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608-.058-1.266-.069-1.646-.069-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308 1.266-.058 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.637.334-3.608 1.308-.971.971-1.25 2.332-1.308 3.608-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.276.337 2.637 1.308 3.608.971.971 2.332 1.25 3.608 1.308 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.637-.337 3.608-1.308.971-.971 1.25-2.332 1.308-3.608.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.337-2.637-1.308-3.608-.971-.971-2.332-1.25-3.608-1.308-1.28-.058-1.688-.07-4.947-.07zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          )}
          {error && <div className="text-red-400 text-center mt-4">{error}</div>}
        </form>
      </div>
    </div>
  );
} 