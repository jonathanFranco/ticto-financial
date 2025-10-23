import {
  UsePaginationProps,
  UsePaginationReturn,
} from "@/models/pagination.model";
import { useMemo, useState } from "react";

export function usePagination<T>({
  data,
  pageSize,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    return {
      totalPages,
      paginatedData,
    };
  }, [data, currentPage, pageSize]);

  const goToPage = (page: number) => {
    const { totalPages } = paginationData;
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const goToNextPage = () => {
    const { totalPages } = paginationData;
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  const adjustPageAfterDeletion = () => {
    const newTotalPages = Math.ceil((data.length - 1) / pageSize);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  return {
    currentPage,
    totalPages: paginationData.totalPages,
    paginatedData: paginationData.paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext: currentPage < paginationData.totalPages,
    canGoPrevious: currentPage > 1,
    resetToFirstPage,
    adjustPageAfterDeletion,
  };
}
