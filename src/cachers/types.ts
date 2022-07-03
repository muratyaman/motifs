export interface ICacher {
  setItem                  (key: string, val: unknown, expiryMs: number): Promise<boolean>;
  getItem<T= unknown>      (key: string)                                : Promise<T>;
  delItem                  (key: string)                                : Promise<boolean>;
  getItemsLike<T = unknown>(keyPrefix: string)                          : Promise<Record<string, T>>;
  getKeys                  (search: string)                             : Promise<string[]>;
}

export interface ICacherConfig {
  kind  : 'memory' | 'redis';
  redis?: {
    url?: string;
  };
}
