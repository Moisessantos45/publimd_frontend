const serializeToJson = <T>(value: unknown, fallback: T[]): T[] => {
  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
};

export { serializeToJson };
