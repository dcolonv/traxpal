interface TableProps {
  headers: string[];
  data: { [key: string]: string }[];
  onCellChange: (rowIndex: number, header: string, value: string) => void;
}

const Table: React.FC<TableProps> = ({ headers, data, onCellChange }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => (
              <td
                key={`${rowIndex}-${header}`}
                className="whitespace-nowrap px-6 py-4"
              >
                <input
                  value={row[header]}
                  onChange={(e) =>
                    onCellChange(rowIndex, header, e.target.value)
                  }
                  className="w-full"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
