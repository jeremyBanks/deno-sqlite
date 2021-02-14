import { QueryParam } from "./db.ts";

export const toSQL = Symbol("toSQL");

type DefaultValueType = null | string | number | boolean;
type DefaultRowType = Array<DefaultValueType>;

export abstract class AsyncSqlConnection<
  RowType = DefaultRowType,
  ValueType = DefaultValueType,
  Dialect = UnknownDialect,
> {
  abstract query(sql: Dialect): AsyncIterable<RowType>;
}

export abstract class SyncSqlConnection<...> extends AsyncSqlConnection<...> {
  async *query(sql: SQLRequest): AsyncIterable<RowType> {
    for (const row of this.querySync(sql)) {
      yield row;
    }
  }

  abstract querySync(sql: SQLRequest): Iterable<RowType>;
}

export type SQLDialect = {
  name: string;
  bindableTypes: unknown;
};

export type UnknownDialect = SQLDialect & {
  name: string;
  bindable: string | boolean | number;
};

export type SQLiteDialect = SQLDialect & {
  name: "sqlite";
  bindable: QueryParam;
};

/**
 * Encodes ("escapes") a string as a SQLite identifier in a SQLExpression.
 */
export const encodeSqliteIdentifier = (
  identifier: string,
  opts: {
    allowWeird?: boolean;
    allowInternal?: boolean;
  } = {},
): SQLExpression<SQLite> => {
  const allowWeird = opts.allowWeird ?? true;
  const allowInternal = opts.allowInternal ?? false;

  if (identifier.includes("\x00")) {
    throw new TypeError('identifier included a ␀ ("\\x00") character');
  }

  const asUtf8 = (new TextEncoder()).encode(identifier);
  const fromUtf8 = (new TextDecoder()).decode(asUtf8);
  if (identifier !== fromUtf8) {
    throw new TypeError(
      "identifier could not be losslessly encoded as UTF-8",
    );
  }

  // In some cases, SQLite may interpret double-quoted and single-quoted strings
  // to be either string literals or identifiers depending on the context. To
  // avoid any potential ambiguity, we use SQLite's other supported quoting
  // characters, although they aren't standard SQL.
  let encoded;
  if (!identifier.includes("]")) {
    // If the identifier doesn't include a closing square bracket, we can just
    // wrap the value in square brackets.
    encoded = `[${identifier}]`;
  } else {
    // Otherwise, wrap it in backticks and double any backticks it contains.
    encoded = "`" + identifier.replace(/`/g, "``") + "`";
  }

  // We quote all identifiers to avoid potential conflict with keywords, but
  // if you're using a name that syntactically *requires* quoting, that's weird.
  const identifierIsWeird = !/^[a-z_][a-z_0-9]*$/i.test(identifier);
  if (identifierIsWeird && !allowWeird) {
    throw new TypeError(
      `Weird SQL identifier ${
        JSON.stringify(identifier)
      }, encoded as ${encoded}, is not allowed.`,
    );
  }

  // Quoting https://github.com/sqlite/sqlite/blob/c8af879e5f501595d5bc59e15621ce25ab76d566/src/build.c#L879-L881
  //
  // > The sqlite3CheckObjectName routine is used to check if the UTF-8
  // > string zName is a legal unqualified name for a new schema object (table,
  // > index, view or trigger). All names are legal except those that begin
  // > with the string "sqlite_" (in upper, lower or mixed case). This portion
  // > of the namespace is reserved for internal use.
  const identifierIsInternal = /^sqlite_/i.test(identifier);
  if (identifierIsInternal && !allowInternal) {
    throw new TypeError(
      `Internal SQLite identifier ${
        JSON.stringify(identifier)
      } is not allowed.`,
    );
  }

  return new SQLExpression([encoded]);
};

export type SQLInterpolated = QueryParam | SQLExpression | {
  [toSQL](): SQLInterpolated;
};
export class SQLExpression<Dialect extends SQLDialect = UnknownDialect> {
  constructor(
    readonly literalSql: string[] = [""],
    readonly sqlParams: Dialect["bindable"][] = [],
  ) {
    if (literalSql.length !== sqlParams.length + 1) {
      throw new TypeError("literalSql.length must equal params.length + 1");
    }
  }
}

/**
 * Tag function constructing a SQLExpression with bound interpolated values.
 */
export const SQL = <Dialect extends SQLDialect = UnknownDialect>(
  strings: TemplateStringsArray,
  ...values: SQLInterpolated[]
): SQLExpression<Dialect> => {
  const flattened: (
    | { string: string; value?: undefined }
    | { value: Dialect["bindable"]; string?: undefined }
  )[] = [];

  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];
    flattened.push({ string });

    if (i < values.length) {
      let value = values[i];
      while (
        !(value instanceof SQLExpression) &&
        typeof (value as any)?.[toSQL] === "function"
      ) {
        value = (value as any)?.[toSQL]();
      }
      if (value instanceof SQLExpression) {
        for (let j = 0; j < value.literalSql.length; j++) {
          flattened.push({ string: value.literalSql[j] });

          if (j < value.sqlParams.length) {
            flattened.push({ value: value.sqlParams[j] });
          }
        }
      } else if (typeof value === "object" && value !== null) {
        throw new TypeError(
          "attempted to interpolate unsupported object into SQL",
        );
      } else {
        flattened.push({ value });
      }
    }
  }

  const flattenedStrings = [];
  const flattenedValues = [];

  let stringBuffer = "";
  for (const { string, value } of flattened) {
    if (string !== undefined) {
      stringBuffer += string;
    } else if (value !== undefined) {
      flattenedStrings.push(stringBuffer);
      stringBuffer = "";
      flattenedValues.push(value);
    } else {
      throw new TypeError("flattened[…].string and .value are both undefined");
    }
  }
  flattenedStrings.push(stringBuffer);

  return new SQLExpression(flattenedStrings, flattenedValues);
};

/**
 * Encodes ("escapes") a string as a SQLite identifier in a SQLExpression.
 */
export const encodeIdentifier = (
  identifier: string,
  opts: {
    allowWeird?: boolean;
    allowInternal?: boolean;
  } = {},
): SQLExpression => {
  const allowWeird = opts.allowWeird ?? true;
  const allowInternal = opts.allowInternal ?? false;

  if (identifier.includes("\x00")) {
    throw new TypeError('identifier included a ␀ ("\\x00") character');
  }

  const asUtf8 = (new TextEncoder()).encode(identifier);
  const fromUtf8 = (new TextDecoder()).decode(asUtf8);
  if (identifier !== fromUtf8) {
    throw new TypeError(
      "identifier could not be losslessly encoded as UTF-8",
    );
  }

  // In some cases, SQLite may interpret double-quoted and single-quoted strings
  // to be either string literals or identifiers depending on the context. To
  // avoid any potential ambiguity, we use SQLite's other supported quoting
  // characters, although they aren't standard SQL.
  let encoded;
  if (!identifier.includes("]")) {
    // If the identifier doesn't include a closing square bracket, we can just
    // wrap the value in square brackets.
    encoded = `[${identifier}]`;
  } else {
    // Otherwise, wrap it in backticks and double any backticks it contains.
    encoded = "`" + identifier.replace(/`/g, "``") + "`";
  }

  // We quote all identifiers to avoid potential conflict with keywords, but
  // if you're using a name that syntactically *requires* quoting, that's weird.
  const identifierIsWeird = !/^[a-z_][a-z_0-9]*$/i.test(identifier);
  if (identifierIsWeird && !allowWeird) {
    throw new TypeError(
      `Weird SQL identifier ${
        JSON.stringify(identifier)
      }, encoded as ${encoded}, is not allowed.`,
    );
  }

  // Quoting https://github.com/sqlite/sqlite/blob/c8af879e5f501595d5bc59e15621ce25ab76d566/src/build.c#L879-L881
  //
  // > The sqlite3CheckObjectName routine is used to check if the UTF-8
  // > string zName is a legal unqualified name for a new schema object (table,
  // > index, view or trigger). All names are legal except those that begin
  // > with the string "sqlite_" (in upper, lower or mixed case). This portion
  // > of the namespace is reserved for internal use.
  const identifierIsInternal = /^sqlite_/i.test(identifier);
  if (identifierIsInternal && !allowInternal) {
    throw new TypeError(
      `Internal SQLite identifier ${
        JSON.stringify(identifier)
      } is not allowed.`,
    );
  }

  return new SQLExpression([encoded]);
};

const tableUnknown = SQL`Users`; // is a SQLString<UnknownDialect>
const queryUnknown = SQL`SELECT * FROM ${tableUnknown}`; // is a SQLString<UnknownDialect>

const tableSqlite = SQL<SQLiteDialect>`Users`; // is a SQLString<SQLiteDialect>
const tableSqlite2 = sqlite.encodeIdentifier("Users"); // is a SQLString<SQLiteDialect>
const querySqlite = SQL`SELECT * FROM ${tableSqlite}`; // is a SQLString<SQLiteDialect> (inferred from interpolated value)

const tableMySQL = SQL<MySQLDialect>`Users`; // is a SQLString<MySQLDialect>
const queryMySQL = SQL`SELECT * FROM ${tableMySQL}`; // is a SQLString<MySQLDialect>

// Mixing known-different dialects should produce a SQLString<never> type, or an error, or something.
const queryIncoherent = SQL
  `SELECT * FROM ${tableMySQL} m JOIN ${tableSqlite} l ON m.Id = l.UserId`;
