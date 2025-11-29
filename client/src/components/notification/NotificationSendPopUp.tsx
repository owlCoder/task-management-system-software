import React, { useState } from 'react';
import type { NotificationSendPopUpProps } from '../../models/notification/NotificationSendPopUpDTO';

const NotificationSendPopUp: React.FC<NotificationSendPopUpProps> = ({
  isOpen,
  onClose,
  onSend,
  className = ""
}) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!content.trim()) {
      return;
    }
    onSend(title, content);
    setTitle('');
    setContent('');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      onClick={handleOverlayClick}
    >
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
        
        <h2 className="text-2xl font-bold text-slate-100 mb-6">
          Send Notification
        </h2>

        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content..."
              rows={5}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!content.trim()}
            className="w-full px-4 py-3 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Notification
          </button>

        </div>

      </div>
    </div>
  );
};

export default NotificationSendPopUp;