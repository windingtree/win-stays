// Stringifies objects with circular dependencies
export const safeObjectStringify = (obj: {}, indent?: number): string => {
  let cache = new Set();

  return JSON.stringify(
    obj,
    (_, value: unknown) => {

      if (value instanceof Error) {
        return Object
          .getOwnPropertyNames(value)
          .reduce<Record<string, unknown>>(
            (a, v) => ({
              ...a,
              [v]: (value as any)[v]
            }),
            {}
          );
      }

      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return;
        }
        cache.add(value);
      }

      return value;
    },
    indent ? indent : undefined
  );
};
