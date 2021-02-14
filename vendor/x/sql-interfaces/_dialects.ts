/**
 * A SqlDialect subtype contains all of the type information associated
 * with a given SQL driver library and its associated SQL engine's
 * SQL language dialect.
 */
export type SqlDialect<
  /** Name of the underlying SQL engine, to identify its unique syntax.
    * Should be a lowercase alphabetic string, like "mysql" or "sqlite".
    * Should be consistent across different drivers for the same engine.
    */
  name extends string = string,

  /** The types that this driver supports for bound parameters.
   */
  driverParameterType extends unknown = unknown,

  /** The row type returned by this driver's query[Sync]() method(s).
   */
  driverRowType extends unknown = unknown,
> = {
  name: name;
  driverParameterType: driverParameterType;
  driverRowType: driverRowType;
};

/** Non-type-checked SQLDialect. */
export type AnyDialect = SqlDialect<string, any, any>;

/** Unknown SQLDialect. */
export type UnknownDialect = SqlDialect;
