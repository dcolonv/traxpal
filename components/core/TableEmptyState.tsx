import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';

export default function TableEmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mt-20 flex flex-col items-center text-center text-gray-900">
      <ArchiveBoxXMarkIcon className="h-10 w-10" />
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}
