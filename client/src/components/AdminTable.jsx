export default function AdminTable({ columns, rows, empty = 'Nothing here yet', minWidth = 640 }) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-[var(--line)] bg-white">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="border-b border-[var(--line)] text-[var(--muted)]">
          <tr>
            {columns.map((c) => (
              <th key={c} className="p-4">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={cells.key ?? i} className="border-b border-[var(--cream)]">
              {cells.map((cell, j) => (
                <td key={j} className="p-4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-8 text-center text-[var(--muted)]">{empty}</p>}
    </div>
  )
}
