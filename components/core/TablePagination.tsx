import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getPaginationFactorsArray } from '@/utils/helpers';

interface TablePaginationProps {
  baseHref: string;
  page: number;
  totalPages: number;
}

export default function TablePagination({
  baseHref,
  page,
  totalPages,
}: TablePaginationProps) {
  const factorArr = getPaginationFactorsArray(totalPages);

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${baseHref}/${page - 1}`}
            className={page <= 1 ? 'pointer-events-none opacity-60' : ''}
          />
        </PaginationItem>
        {/* If current page is greater than 3, show ellipsis at begining */}
        {page > 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {factorArr.map((fact, idx) => {
          const linkPage = page > 3 ? page - fact : idx + 1;
          return (
            <PaginationItem key={fact}>
              <PaginationLink
                href={`${baseHref}/${linkPage}`}
                isActive={page === linkPage}
              >
                {linkPage}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {totalPages > 3 && page <= totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href={`${baseHref}/${page + 1}`}
            className={
              page >= totalPages ? 'pointer-events-none opacity-60' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
