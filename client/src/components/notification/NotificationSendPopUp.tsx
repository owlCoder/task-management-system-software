import React, { useState } from 'react';
import type { NotificationSendPopUpProps } from '../../models/notification/NotificationSendPopUpDTO';
import { NotificationType } from '../../enums/NotificationType';

const NotificationSendPopUp: React.FC<NotificationSendPopUpProps> = ({
  isOpen,
  onClose,
  onSend,
  loading = false,
  className = ""
}) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<NotificationType | ''>('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [typeError, setTypeError] = useState('');

  const MAX_TITLE_LENGTH = 50;
  const MAX_CONTENT_LENGTH = 320;

  const handleClose = () => {
    setTitle('');
    setContent('');
    setType('');
    setTitleError('');
    setContentError('');
    setTypeError('');
    onClose();
  };

  const handleSend = () => {
    let hasError = false;

    // Validacija title
    if (!title.trim()) {
      setTitleError('Title is required!');
      hasError = true;
    } else if (title.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title must not exceed ${MAX_TITLE_LENGTH} characters!`);
      hasError = true;
    } else {
      setTitleError('');
    }

    // Validacija content
    if (!content.trim()) {
      setContentError('Content is required!');
      hasError = true;
    } else if (content.length > MAX_CONTENT_LENGTH) {
      setContentError(`Content must not exceed ${MAX_CONTENT_LENGTH} characters!`);
      hasError = true;
    } else {
      setContentError('');
    }

    // Validacija type
    if (!type) {
      setTypeError('Type is required!');
      hasError = true;
    } else {
      setTypeError('');
    }

    if (hasError) {
      return;
    }

    onSend(title, content, type as NotificationType);
    setTitle('');
    setContent('');
    setType('');
    setTitleError('');
    setContentError('');
    setTypeError('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    if (value.trim() && value.length <= MAX_TITLE_LENGTH) {
      setTitleError('');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    if (value.trim() && value.length <= MAX_CONTENT_LENGTH) {
      setContentError('');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const modalButtonBase =
    "flex-1 h-11 rounded-lg font-semibold text-sm transition-all duration-300 border border-white/15 bg-white/10 text-white/70 backdrop-blur-xl hover:bg-gradient-to-t hover:from-[var(--palette-medium-blue)] hover:to-[var(--palette-deep-blue)] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className={`fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md flex items-center justify-center z-50 ${className}`}
      onClick={handleOverlayClick}
    >
      <div className="bg-white/5 border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl backdrop-blur-xl">
        
        {/* header sa X dugmetom */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Send Notification
          </h2>
          
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition"
            disabled={loading}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* form */}
        <div className="space-y-4">
          
          {/* Title Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-white/70">
                Title *
              </label>
              <span className={`text-xs ${title.length > MAX_TITLE_LENGTH ? 'text-red-400' : 'text-white/50'}`}>
                {title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter title..."
              maxLength={MAX_TITLE_LENGTH}
              className={`w-full bg-white/10 border ${titleError ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white/90 placeholder-white/50 focus:outline-none focus:border-[var(--palette-medium-blue)] transition`}
              disabled={loading}
            />
            {titleError && (
              <p className="mt-1 text-sm text-red-400">{titleError}</p>
            )}
          </div>

          {/* Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-white/70">
                Content *
              </label>
              <span className={`text-xs ${content.length > MAX_CONTENT_LENGTH ? 'text-red-400' : 'text-white/50'}`}>
                {content.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Enter content..."
              rows={5}
              maxLength={MAX_CONTENT_LENGTH}
              className={`w-full bg-white/10 border ${contentError ? 'border-red-500' : 'border-white/15'} rounded-lg px-4 py-3 text-white/90 placeholder-white/50 focus:outline-none focus:border-[var(--palette-medium-blue)] transition resize-none`}
              disabled={loading}
            />
            {contentError && (
              <p className="mt-1 text-sm text-red-400">{contentError}</p>
            )}
          </div>

        {/* Type Buttons */}
        <div>
          <label className="block text-sm font-semibold text-white/70 mb-2">
            Type *
          </label>
          <div className="flex gap-3">
            {[
              { label: "Info", value: NotificationType.INFO },
              { label: "Warning", value: NotificationType.WARNING },
              { label: "Error", value: NotificationType.ERROR },
            ].map((option) => {
              const isActive = type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setType(option.value);
                    setTypeError("");
                  }}
                  disabled={loading}
                  className={`flex-1 h-11 rounded-lg font-semibold text-sm transition-all duration-300 border border-white/15 backdrop-blur-xl ${
                    isActive
                      ? "bg-gradient-to-t from-[var(--palette-medium-blue)] to-[var(--palette-deep-blue)] text-white shadow-lg shadow-sky-500/20 -translate-y-0.5"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {typeError && (
            <p className="mt-1 text-sm text-red-400">{typeError}</p>
          )}
        </div>

        </div>

        {/* footer sa cancel i send */}
        <div className="mt-6">
          <div className="h-px w-full bg-white/10 mb-4"></div>
          <div className="flex gap-3">
          
            <button
              onClick={handleClose}
              disabled={loading}
              className={modalButtonBase}
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={loading}
              className={`${modalButtonBase} flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Notification'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotificationSendPopUp;
