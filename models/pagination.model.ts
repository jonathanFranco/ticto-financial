export interface UsePaginationProps<T> {
  data: T[];
  pageSize: number;
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedData: T[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  resetToFirstPage: () => void;
  adjustPageAfterDeletion: () => void;
}
