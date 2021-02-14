import { SqlDialect, UnknownDialect } from "./mod.ts";

type SqlQueryString<
  Dialect extends SqlDialect = UnknownDialect,
> = string;

type SqlQueryParameters<
  Dialect extends SqlDialect = UnknownDialect,
> = Array<Dialect["driverParameterType"]>;

export type SqlQuery<
  Dialect extends SqlDialect = UnknownDialect,
> = {
  readonly queryString: SqlQueryString<Dialect>;
  readonly parameters: SqlQueryParameters<Dialect>;
};

export type SqlQueryContext<
  Dialect extends SqlDialect = UnknownDialect,
> = {
  abortSignal?: AbortSignal;
};
