
import type { Pagination } from "@/entities/pagination";
import { getNumber } from "./formatters";

const mapperPagination = (data: Record<string, unknown>): Pagination => ({
  total: getNumber(data.total),
  totalPages: getNumber(data.totalPages),
  page: getNumber(data.page, 1),
  pageSize: getNumber(data.pageSize, 10),
});

export { mapperPagination };