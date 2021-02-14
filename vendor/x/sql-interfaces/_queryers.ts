import {
  SqlDialect,
  SqlQuery,
  SqlQueryContext,
  UnknownDialect,
} from "./mod.ts";

type RowType<Dialect extends SqlDialect> = SqlDialect["driverRowType"];

export interface Queryer<
  Dialect extends SqlDialect = UnknownDialect,
> {
  query(
    query: SqlQuery<Dialect>,
    context?: SqlQueryContext<Dialect>,
  ): AsyncIterable<RowType<SqlDialect>>;
}

export interface QueryerSync<
  Dialect extends SqlDialect = UnknownDialect,
> {
  querySync(
    query: SqlQuery<Dialect>,
    context?: SqlQueryContext<Dialect>,
  ): Iterable<RowType<SqlDialect>>;
}

/**
 * Abstract implementation of Querier from QueryerSync.
 */
export abstract class AbstractQueryerSync<
  Dialect extends SqlDialect = UnknownDialect,
> implements Queryer<Dialect>, QueryerSync<Dialect> {
  abstract querySync(
    query: SqlQuery<Dialect>,
    context?: SqlQueryContext<Dialect>,
  ): Iterable<RowType<SqlDialect>>;

  async *query(
    query: SqlQuery<Dialect>,
    context?: SqlQueryContext<Dialect>,
  ) {
    yield* this.querySync(query, context);
  }
}
