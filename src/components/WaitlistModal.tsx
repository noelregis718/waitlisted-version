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
    setSuccess(true);
    setForm({ name: '', email: '', company: '', usecase: '' });
    setTimeout(() => { setSuccess(false); onClose(); }, 2500);
  };

  return (
    <div ref={modalRef} onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#181F2A] rounded-2xl shadow-xl w-full max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-8 text-white">Request Early Access</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Name</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#101624] border border-gray-700 text-white placeholder-gray-400" placeholder="" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#101624] border border-gray-700 text-white placeholder-gray-400" placeholder="" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Company</label>
            <input name="company" type="text" value={form.company} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#101624] border border-gray-700 text-white placeholder-gray-400" placeholder="" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-white text-left">Use Case</label>
            <textarea name="usecase" value={form.usecase} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#101624] border border-gray-700 text-white placeholder-gray-400" rows={3} placeholder="Tell us how you plan to use AnkFin..." />
          </div>
          <button type="submit" disabled={loading} className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg hover:from-blue-600 hover:to-cyan-500 transition disabled:opacity-60">{loading ? 'Sending...' : 'Request Access'}</button>
          {success && <div className="text-green-400 text-center mt-4">Request sent! We'll be in touch.</div>}
          {error && <div className="text-red-400 text-center mt-4">{error}</div>}
        </form>
      </div>
    </div>
  );
} 