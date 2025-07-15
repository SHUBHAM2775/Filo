import { useState, useEffect } from 'react';

function renderFormattedContent(content) {
  if (!content) return null;
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br/>')
    .replace(/  /g, '&nbsp;&nbsp;');
  return <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--pixel-font)', marginBottom: 12, fontSize: 18, textAlign: 'left', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function DataModal({ open, onClose, onSave, data, mode }) {
  const [title, setTitle] = useState(data?.title || '');
  const [content, setContent] = useState(data?.content || '');
  const [file, setFile] = useState(null);

  useEffect(() => {
    setTitle(data?.title || '');
    setContent(data?.content || '');
    setFile(null);
  }, [data, open]);

  if (!open) return null;

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) formData.append('file', file);
    onSave(formData);
  };

  const isImage = (url) => url && (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.webp'));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={mode === 'view' ? {
        minWidth: 600,
        maxWidth: '95vw',
        maxHeight: '95vh',
        width: '100%',
        padding: '3rem 3.5rem',
        alignItems: 'flex-start',
      } : {}}>
        <h2 style={{ marginBottom: 24, width: '100%', textAlign: 'center', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 }}>{mode === 'view' ? title : (mode === 'add' ? 'Add Data' : 'Edit Data')}</h2>
        {mode === 'view' ? (
          <div style={{ width: '100%' }}>
            <hr style={{ width: '100%', border: '1.5px solid var(--primary)', margin: '0 0 18px 0' }} />
            {renderFormattedContent(content)}
            {data?.fileUrl && (
              <div style={{ margin: '24px 0', textAlign: 'center' }}>
                {isImage(data.fileUrl) ? (
                  <img src={data.fileUrl} alt="uploaded" style={{ maxWidth: 420, maxHeight: 320, borderRadius: 8, border: '2px solid var(--primary)', marginBottom: 8 }} />
                ) : (
                  <a href={data.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 'bold', fontSize: 20, padding: '12px 0', display: 'inline-block' }}>
                    Open File
                  </a>
                )}
              </div>
            )}
            <button className="pixel-btn" style={{ width: '100%', marginTop: 16 }} onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }} encType="multipart/form-data">
            <input
              className="pixel-input"
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={mode === 'view'}
            />
            <textarea
              className="pixel-input"
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              style={{ resize: 'vertical', width: '100%' }}
              disabled={mode === 'view'}
            />
            {/* File upload (optional) */}
            {mode !== 'view' && (
              <input
                className="pixel-input"
                type="file"
                accept="image/*,.txt,.pdf,.doc,.docx"
                onChange={e => setFile(e.target.files[0])}
                style={{ marginBottom: 12 }}
              />
            )}
            {mode !== 'view' && (
              <button type="submit" className="pixel-btn" style={{ width: '100%' }}>
                {mode === 'add' ? 'Add' : 'Save'}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
} 