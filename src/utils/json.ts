export function jsonStringify(v: unknown, throwError = false): string {
  try {
    const s = JSON.stringify(v);
    return s;
  } catch (e) {
    if (throwError) throw e;
  }
  return '';
}
