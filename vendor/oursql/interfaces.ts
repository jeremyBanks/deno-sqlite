export type DefaultValueType = null | string | number | boolean;
export type DefaultRowType = Array<DefaultValueType>;

export type SqlDialect<
  name extends string = string,
  bindableTypes = DefaultValueType,
  rowType = Iterable<Array<bindableTypes>>,
> = {
  name: name;
  bindableTypes: bindableTypes;
  rowsType: rowType;
};

export type AbstractSqlDialect = SqlDialect<string, unknown, unknown>;

export type DenoSqliteDialect = SqlDialect<
  "sqlite",
  | boolean
  | number
  | bigint
  | string
  | null
  | undefined
  | Date
  | Uint8Array,
  typeof import("https://deno.land/x/sqlite/src/rows.ts")["Rows"]
>;

export type SqlRequest<
  Dialect extends AbstractSqlDialect = AbstractSqlDialect,
> = {
  getSqlString(): string;
  getBoundValues(): Array<Dialect["bindableTypes"]>;
};

//

export class SqlString<Dialect extends AbstractSqlDialect = AbstractSqlDialect>
  implements SqlRequest<Dialect> {
}
