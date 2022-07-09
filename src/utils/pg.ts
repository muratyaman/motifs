import { jsonStringify } from "./json";

export function pgEncodeToSend(message: unknown): string {
  const json = jsonStringify(message);
  return Buffer.from(json).toString('base64'); 
}

export function pgDecodeReceived<T = unknown>(message: string): T {
  const json = Buffer.from(message, 'base64').toString('utf8');
  return JSON.parse(json) as T;
}
