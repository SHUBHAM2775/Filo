export default function DataTable({ data, onSelect }) {
  return (
    <div className="pixel-table-container">
      <table className="pixel-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={2} style={{ textAlign: 'center', color: '#888' }}>No data yet</td></tr>
          ) : (
            data.map(item => (
              <tr key={item._id} onClick={() => onSelect(item)} className="pixel-row">
                <td>{item.title}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 