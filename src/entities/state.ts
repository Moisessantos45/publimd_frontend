interface StatusGeneric {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const initialStatusGeneric: StatusGeneric = {
  id: -1,
  name: "",
  createdAt: "",
  updatedAt: "",
};

export { initialStatusGeneric };
export type { StatusGeneric };
