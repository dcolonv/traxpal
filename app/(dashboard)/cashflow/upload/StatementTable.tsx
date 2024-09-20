import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TableProps {
  headers: string[];
  data: { [key: string]: string }[];
  onCellChange: (rowIndex: number, header: string, value: string) => void;
}

const inputHeaders = ['Account', 'Subaccount', 'Client/Provider', 'Detail'];

const AccountHeaderContent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: any) => void;
}) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select an account" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Account</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

const SubaccountHeaderContent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: any) => void;
}) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select an subaccount" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Subccount</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

const ClientProviderHeaderContent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: any) => void;
}) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger className="w-[280px]">
      <SelectValue placeholder="Select an client/provider" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Client/Provider</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

const DetailHeaderContent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: any) => void;
}) => <Input className="w-[280px]" onChange={onChange} value={value} />;

const getHeaderContent = ({
  header,
  value,
  onChange,
}: {
  header: string;
  value: string;
  onChange: (e: any) => void;
}) => {
  switch (header) {
    case 'Account':
      return AccountHeaderContent({ value, onChange });
    case 'Subaccount':
      return SubaccountHeaderContent({ value, onChange });
    case 'Client/Provider':
      return ClientProviderHeaderContent({ value, onChange });
    default:
      return DetailHeaderContent({ value, onChange });
  }
};

const StatementTable: React.FC<TableProps> = ({
  headers,
  data,
  onCellChange,
}) => {
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
                {inputHeaders.includes(header) ? (
                  getHeaderContent({
                    header,
                    value: row[header.toLowerCase()],
                    onChange: (e) =>
                      onCellChange(rowIndex, header, e.target.value),
                  })
                ) : (
                  <>{row[header.toLowerCase()]}</>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StatementTable;
