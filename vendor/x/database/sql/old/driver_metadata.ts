/**
 * A SqlDriverMetadata subtype contains the key type information associated
 * with a given SQL driver library and its associated SQL engine's
 * SQL language dialect.
 */
export type SqlDriverMetadata<
  /** Name of the underlying SQL engine, to identify its unique syntax.
    * Should be a lowercase alphabetic string, like "mysql" or "sqlite".
    * Should be consistent across different drivers for the same engine.
    */
  dialectName extends string = string,
  /** The types that this driver supports for bound parameters.
   */
  parameterType extends unknown = unknown,
  /** The row type returned by this driver's query[Sync]() method(s).
   */
  rowType extends unknown = unknown,
> = {
  dialectName: dialectName;
  parameterType: parameterType;
  rowType: rowType;
};

export type AnyDriverMetadata = SqlDriverMetadata<string, any, any>;

export type UnknownDiverMetadata = SqlDriverMetadata<string, unknown, unknown>;

// I guess these really should be broken up into separate types
// and unified by the way they extend the abstract database class?
