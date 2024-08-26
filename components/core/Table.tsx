import { useState } from 'react';

interface TableProps {
  headers: string[];
  data: { [key: string]: string }[];
  onCellChange: (rowIndex: number, header: string, value: string) => void;
}

const Table: React.FC<TableProps> = ({ headers, data, onCellChange }) => {
  const [editRow, setEditRow] = useState<number>();
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              scope="col"
              className="whitespace-nowrap py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              {header}
            </th>
          ))}
          <th
            scope="col"
            className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
          >
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => (
              <td
                key={`${rowIndex}-${header}`}
                className="whitespace-nowrap px-2 py-2 text-sm text-gray-500"
              >
                {rowIndex === editRow ? (
                  <input
                    value={row[header.toLowerCase()]}
                    onChange={(e) =>
                      onCellChange(rowIndex, header, e.target.value)
                    }
                    className="w-full"
                  />
                ) : (
                  <>{row[header.toLowerCase()]}</>
                )}
              </td>
            ))}
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              <button
                className="text-indigo-600 hover:text-indigo-900"
                onClick={() => setEditRow(rowIndex)}
              >
                Edit<span className="sr-only">, {rowIndex}</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
