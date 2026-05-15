interface Pagination {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

const initialPaginationState: Pagination = {
  total: 0,
  totalPages: 1,
  page: 1,
  pageSize: 10,
};


export { initialPaginationState };
export type { Pagination };
