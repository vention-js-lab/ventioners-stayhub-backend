export function omit<T>(obj: T, keys: (keyof T)[]) {
  const res = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key as keyof T)) {
      res[key] = obj[key];
    }
  }

  return res;
}
