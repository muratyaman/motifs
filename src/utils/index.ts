import { randomUUID } from 'crypto';

export function uuid() { return randomUUID(); }

export function ts() { return (new Date()).toISOString(); }

export function jsonStringfy(v: unknown, throwErr = false): string {
  try {
    const s = JSON.stringify(v);
    return s;
  } catch (err) {
    if (throwErr) throw err;
  }
  return '';
}

const SEP = '::'; // just separator for creating namespace for different collections of record in same cache/table

export const makeKeyMaker = (name: string) => {
  return (id: string) => `${name}${SEP}${id}`;
}

export const makeId = (key: string) => key.split(SEP)[1];
