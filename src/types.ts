import { createClient } from "redis";

export type IObject     = Record<string, unknown>;
export type IFlatObject = Record<string, string | number | boolean | null>;

export type IdType      = string; // | number; // string/uuid/integer
export type RawDateType = string; // | number; // 'iso-date-string' or unix timestamp
export type RawBool     = boolean; // | number;

export interface IBaseDto extends IObject {
  id       : IdType;
  createdAt: RawDateType;
  updatedAt: RawDateType;
}

export type IJsonScalar = string | number | boolean | null;
export type IJsonList   = Array<IJsonScalar>;
export type IJsonObject = Record<string, IJsonScalar>;
export type IJson       = IJsonScalar | IJsonList | IJsonObject;

export type RedisClient = ReturnType<typeof createClient>;
