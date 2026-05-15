import type { StatusGeneric } from "@/entities/state";
import { getDateToString, getNumber } from "./formatters";

const mapperStateGeneric = (data: any): StatusGeneric => {
  return {
    id: getNumber(data.id,1),
    name: data.name,
    createdAt: getDateToString(data.created_at),
    updatedAt: getDateToString(data.updated_at),
  };
};

export { mapperStateGeneric };
