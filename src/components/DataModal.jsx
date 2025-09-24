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
  const [files, setFiles] = useState([]);
  const [fileDataUrls, setFileDataUrls] = useState({});

  useEffect(() => {
    setTitle(data?.title || '');
    setContent(data?.content || '');
    setFiles([]);
    setFileDataUrls({});
  }, [data, open]);

  // Fetch file data when viewing files
  useEffect(() => {
    if (mode === 'view' && data?.files && Array.isArray(data.files)) {
      const fetchFiles = async () => {
        try {
          const token = sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : '';
          const API_BASE = import.meta.env.VITE_API_URL || '';
          const urls = {};
          
          for (const file of data.files) {
            if (file._id) {
              const response = await fetch(`${API_BASE}/api/data/file/${file._id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                urls[file._id] = url;
              }
            }
          }
          
          setFileDataUrls(urls);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      };
      fetchFiles();
    }

    // Handle legacy single file
    if (mode === 'view' && data?.fileUrl && data.fileUrl.includes('/api/data/file/') && (!data.files || data.files.length === 0)) {
      const fetchLegacyFile = async () => {
        try {
          const token = sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : '';
          const API_BASE = import.meta.env.VITE_API_URL || '';
          const response = await fetch(`${API_BASE}${data.fileUrl}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setFileDataUrls({ legacy: url });
          }
        } catch (error) {
          console.error('Error fetching legacy file:', error);
        }
      };
      fetchLegacyFile();
    }

    // Cleanup object URLs
    return () => {
      Object.values(fileDataUrls).forEach(url => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [data, mode]);

  if (!open) return null;

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    // Append all selected files
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    onSave(formData);
  };

  const isImage = (fileName, mimeType) => {
    if (mimeType) {
      return mimeType.startsWith('image/');
    }
    if (fileName) {
      return fileName.match(/\.(png|jpg|jpeg|gif|webp)$/i);
    }
    return false;
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const token = sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : '';
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/data/file/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleLegacyFileDownload = async () => {
    if (!data?.fileUrl) return;
    
    try {
      const token = sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : '';
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}${data.fileUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      const token = sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : '';
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/data/file/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Refresh the data to show updated file list
        // This would need to be handled by parent component
        window.location.reload(); // Simple solution for now
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const renderFilesList = (files) => {
    if (!files || files.length === 0) return null;
    
    return (
      <div style={{ margin: '24px 0' }}>
        <h3 style={{ fontFamily: 'var(--pixel-font)', fontSize: 20, marginBottom: 16, color: 'var(--primary)' }}>
          📎 Attached Files ({files.length})
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {files.map((file, index) => (
            <div key={file._id || index} style={{
              border: '2px solid var(--primary)',
              borderRadius: 8,
              padding: '12px',
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ flex: 1 }}>
                {isImage(file.originalName, file.mimeType) && fileDataUrls[file._id] ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={fileDataUrls[file._id]} 
                      alt={file.originalName} 
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover',
                        borderRadius: 4, 
                        border: '1px solid var(--primary)'
                      }} 
                    />
                    <div>
                      <div style={{ fontFamily: 'var(--pixel-font)', fontSize: 16, fontWeight: 'bold' }}>
                        {file.originalName}
                      </div>
                      <div style={{ fontSize: 14, opacity: 0.7 }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontFamily: 'var(--pixel-font)', fontSize: 16, fontWeight: 'bold' }}>
                      📄 {file.originalName}
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.7 }}>
                      {(file.size / 1024).toFixed(1)} KB • {file.mimeType}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="pixel-btn"
                  onClick={() => handleFileDownload(file._id, file.originalName)}
                  style={{ 
                    padding: '6px 12px',
                    fontSize: 14,
                    color: 'var(--primary)'
                  }}
                >
                  ⬇️ Download
                </button>
                {mode === 'edit' && (
                  <button
                    className="pixel-btn"
                    onClick={() => handleFileDelete(file._id)}
                    style={{ 
                      padding: '6px 12px',
                      fontSize: 14,
                      color: '#d32f2f',
                      borderColor: '#d32f2f'
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Set API base URL from environment variable (for Vercel deployment)
  const API_BASE = import.meta.env.VITE_API_URL || '';

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
        <h2 style={{ marginBottom: 24, width: '100%', textAlign: 'center', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 }}>
          {mode === 'view' ? title : (mode === 'add' ? 'Add Data' : mode === 'edit' ? 'Edit Data' : 'Data')}
        </h2>
        {mode === 'view' ? (
          <div style={{ width: '100%' }}>
            <hr style={{ width: '100%', border: '1.5px solid var(--primary)', margin: '0 0 18px 0' }} />
            {renderFormattedContent(content)}
            
            {/* Display multiple files */}
            {data?.files && data.files.length > 0 && renderFilesList(data.files)}
            
            {/* Legacy single file support */}
            {data?.fileUrl && (!data.files || data.files.length === 0) && (
              <div style={{ margin: '24px 0', textAlign: 'center' }}>
                {isImage(data.fileName, data.fileMimeType) && fileDataUrls.legacy ? (
                  <img 
                    src={fileDataUrls.legacy} 
                    alt={data.fileName || "uploaded"} 
                    style={{ 
                      maxWidth: 420, 
                      maxHeight: 320, 
                      borderRadius: 8, 
                      border: '2px solid var(--primary)', 
                      marginBottom: 8 
                    }} 
                  />
                ) : (
                  <button 
                    className="pixel-btn"
                    onClick={handleLegacyFileDownload}
                    style={{ 
                      color: 'var(--primary)', 
                      fontSize: 20, 
                      padding: '12px 24px', 
                      display: 'inline-block',
                      marginBottom: 8
                    }}
                  >
                    📁 Download {data.fileName || 'File'}
                  </button>
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
            {/* Multiple file upload */}
            {mode !== 'view' && (
              <div style={{ marginBottom: 12 }}>
                <input
                  className="pixel-input"
                  type="file"
                  multiple
                  accept="image/*,.txt,.pdf,.doc,.docx,.zip,.rar"
                  onChange={e => setFiles(Array.from(e.target.files))}
                  style={{ marginBottom: 8 }}
                />
                {files.length > 0 && (
                  <div style={{ 
                    fontSize: 14, 
                    color: 'var(--primary)', 
                    fontFamily: 'var(--pixel-font)',
                    marginTop: 8
                  }}>
                    📎 {files.length} file{files.length !== 1 ? 's' : ''} selected
                    <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                      {files.map((file, index) => (
                        <li key={index} style={{ fontSize: 12, opacity: 0.8 }}>
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {/* Show existing files in edit mode */}
            {mode === 'edit' && data?.files && data.files.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {renderFilesList(data.files)}
              </div>
            )}
            
            {mode !== 'view' && (
              <button type="submit" className="pixel-btn" style={{ width: '100%' }}>
                {mode === 'add' ? 'Add' : mode === 'edit' ? 'Save Changes' : 'Save'}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
} 