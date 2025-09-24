import { useState, useRef, useEffect } from 'react';

export default function DataTable({ data, onSelect, onEdit, onDelete, onBulkDelete }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const tableRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (openMenuId && !event.target.closest('.action-menu-wrapper')) {
        setOpenMenuId(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleMenuToggle = (id, event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenMenuId(prevId => prevId === id ? null : id);
  };

  const handleAction = (action, item, event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpenMenuId(null);
    
    if (action === 'edit') {
      onEdit(item);
    } else if (action === 'delete') {
      onDelete(item);
    }
  };

  const handleRowClick = (item, event) => {
    // Don't trigger row click if clicking on menu wrapper or checkbox
    if (event.target.closest('.action-menu-wrapper') || event.target.closest('.checkbox-cell')) {
      return;
    }
    
    if (selectMode) {
      toggleItemSelection(item._id);
    } else {
      onSelect(item);
    }
  };

  const toggleItemSelection = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === data.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.map(item => item._id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.size > 0) {
      const selectedData = data.filter(item => selectedItems.has(item._id));
      onBulkDelete(selectedData);
      setSelectedItems(new Set());
      setSelectMode(false);
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedItems(new Set());
  };

  return (
    <div className="pixel-table-container" style={{ overflow: 'visible' }}>
      {/* Bulk Action Bar */}
      {selectMode && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'var(--accent)',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '2px solid var(--primary)',
        }}>
          <span style={{ 
            fontFamily: 'var(--pixel-font)', 
            fontWeight: 'bold',
            color: 'var(--primary)'
          }}>
            {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="pixel-btn"
              onClick={handleBulkDelete}
              disabled={selectedItems.size === 0}
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                borderColor: '#d32f2f',
                padding: '8px 16px',
                fontSize: '14px',
                opacity: selectedItems.size === 0 ? 0.5 : 1,
                cursor: selectedItems.size === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              🗑️ Delete ({selectedItems.size})
            </button>
            <button
              className="pixel-btn"
              onClick={exitSelectMode}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Select Mode Toggle */}
      {!selectMode && data.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '12px' 
        }}>
          <button
            className="pixel-btn"
            onClick={() => setSelectMode(true)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
            }}
          >
            📋 Select Multiple
          </button>
        </div>
      )}

      <table className="pixel-table" ref={tableRef} style={{ overflow: 'visible' }}>
        <thead>
          <tr>
            {selectMode && (
              <th style={{ width: '50px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedItems.size === data.length && data.length > 0}
                  onChange={toggleSelectAll}
                  style={{
                    transform: 'scale(1.2)',
                    cursor: 'pointer',
                  }}
                />
              </th>
            )}
            <th>Title</th>
            <th>Files</th>
            <th>Date</th>
            <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={selectMode ? 5 : 4} style={{ textAlign: 'center', color: '#888' }}>No data yet</td></tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={item._id} 
                className={`pixel-row ${selectedItems.has(item._id) ? 'selected-row' : ''}`}
                onClick={(e) => handleRowClick(item, e)}
                style={{
                  backgroundColor: selectedItems.has(item._id) ? 'rgba(255, 179, 71, 0.3)' : 'transparent',
                }}
              >
                {selectMode && (
                  <td className="checkbox-cell" style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item._id)}
                      onChange={() => toggleItemSelection(item._id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        transform: 'scale(1.2)',
                        cursor: 'pointer',
                      }}
                    />
                  </td>
                )}
                <td style={{ cursor: selectMode ? 'pointer' : 'pointer' }}>{item.title}</td>
                <td style={{ cursor: selectMode ? 'pointer' : 'pointer', textAlign: 'center' }}>
                  {(() => {
                    const fileCount = (item.files && item.files.length) || (item.fileUrl ? 1 : 0);
                    if (fileCount === 0) {
                      return <span style={{ opacity: 0.5 }}>—</span>;
                    }
                    return (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'var(--accent)',
                        border: '1px solid var(--primary)',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'var(--primary)'
                      }}>
                        📎 {fileCount}
                      </span>
                    );
                  })()}
                </td>
                <td style={{ cursor: selectMode ? 'pointer' : 'pointer' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td style={{ position: 'relative', overflow: 'visible' }}>
                  <div className="action-menu-wrapper" style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                  }}>
                    <button
                      className="menu-button"
                      data-menu-id={item._id}
                      onClick={(e) => handleMenuToggle(item._id, e)}
                      style={{
                        background: 'var(--surface)',
                        border: '2px solid var(--primary)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '8px 10px',
                        fontSize: '16px',
                        color: 'var(--primary)',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        minWidth: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'var(--accent)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'var(--surface)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ⋮
                    </button>
                    
                    {openMenuId === item._id && (
                      <div
                        className="action-menu"
                        style={{
                          position: 'absolute',
                          background: 'var(--surface)',
                          border: '2px solid var(--primary)',
                          borderRadius: '8px',
                          boxShadow: '4px 4px 16px rgba(0,0,0,0.3)',
                          zIndex: 10000,
                          minWidth: '140px',
                          overflow: 'visible',
                          animation: 'dropdownFadeIn 0.2s ease-out',
                          left: 'calc(100% + 8px)',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <button
                          onClick={(e) => handleAction('edit', item, e)}
                          style={{
                            width: '100%',
                            padding: '14px 18px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontFamily: 'var(--pixel-font)',
                            textAlign: 'left',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                            transition: 'background-color 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '500',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleAction('delete', item, e)}
                          style={{
                            width: '100%',
                            padding: '14px 18px',
                            border: 'none',
                            background: 'transparent',
                            color: '#d32f2f',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontFamily: 'var(--pixel-font)',
                            textAlign: 'left',
                            transition: 'background-color 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '500',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#ffebee'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <style>
        {`
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        `}
      </style>
    </div>
  );
} 