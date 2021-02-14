export const encodeIdentifier = Symbol(
  "/x/database/sql/driver#encodeIdentifier",
);

const Types = Symbol("internal phantom types for /x/database/sql/driver");

// use to brand types and attach metadata
export type WithTypes<T> = {
  [Types]?: T;
};
export type TypesOf<T extends { [Types]?: unknown }> = Exclude<
  T[typeof Types],
  undefined
>;

const TypeError = Symbol("TypeError");

type TypeError<Message extends string> = {
  [TypeError]: Message;
};

type SqlDialectNameBase =
  | "sqlite"
  | "mysql"
  | "postgresql"
  | "tsql"
  | null;

type DriverParameterBase = unknown;
type DriverParametersBase =
  | Array<DriverParameterBase>
  | Record<string, DriverParameterBase>;
type DriverRowBase = unknown;
type DriverRowsBase = AsyncIterable<unknown>;
type DriverRowsBaseSync = Iterable<unknown>;

export type BaseDriver = Driver<
  SqlDialectNameBase,
  DriverParameterBase,
  DriverParametersBase,
  DriverRowBase,
  DriverRowsBase,
  DriverRowsBaseSync
>;

export interface Driver<
  sqlDialectName extends SqlDialectNameBase = SqlDialectNameBase,
  Parameter extends DriverParameterBase = TypeError<
    "driver has no Parameter type"
  >,
  Parameters extends DriverParametersBase = TypeError<
    "driver has no Parameters type"
  >,
  Row extends DriverRowBase = TypeError<"driver has no Row type">,
  Rows extends DriverRowsBase = AsyncIterable<
    TypeError<"driver has no Rows type">
  >,
  RowsSync extends DriverRowsBaseSync = Iterable<
    TypeError<"driver has no RowsSync type">
  >,
> extends
  WithTypes<{
    sqlDialectName: sqlDialectName;
    Parameter: Parameter;
    Parameters: Parameters;
    Row: Row;
    Rows: Rows;
    RowsSync: RowsSync;
  }> {
  open(database: string): Connection<this>;

  [encodeIdentifier]?(identifier: string): string;
}

export interface Connection<Driver extends BaseDriver> extends
  WithTypes<{
    Driver: Driver;
  }> {
  query?(query: Query<Driver>): TypesOf<Driver>["Rows"];

  querySync?(query: Query<Driver>): TypesOf<Driver>["RowsSync"];

  queryRowSync?(query: Query<Driver>): TypesOf<Driver>["Row"];

  queryRow?(query: Query<Driver>): Promise<TypesOf<Driver>["Row"]>;
}

export interface Query<Driver extends BaseDriver> extends
  WithTypes<{
    Driver: Driver;
  }> {
  readonly sql: string;
  readonly parameters: TypesOf<Driver>["Parameters"];
}


export const moduleDriver = <Driver>(module: Driver) => module as Module & Driver<

    TypesOf<Module["types"]>["sqlDialectName"],
    module extends 
    TypesOf<Module["types"]>["rows"]
>;

import * as xSqlite from "../x/sqlite.ts";
export const sqlite = moduleDriver(xSqlite);
