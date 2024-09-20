import { ArchiveBoxXMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';

export default function EmptyState({
  title,
  subtitle,
  action,
  onClick,
}: {
  title: string;
  subtitle: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-10 flex flex-col items-center text-center text-gray-900">
      <ArchiveBoxXMarkIcon className="h-10 w-10" />
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      <div className="mt-4">
        <Button onClick={onClick}>
          <PlusIcon aria-hidden="true" className="mr-2 h-4 w-4" />
          {action}
        </Button>
      </div>
    </div>
  );
}
