# [x/sql-interface](https://deno.land/x/sql-interface)

A generic interface for SQL databases in Deno. Typically used with a compatible
database driver library such as:

- https://deno.land/x/sqlite

Loosely modeled after
[Go's standard `database/sql` package](https://pkg.go.dev/database/sql):

> Package `sql` provides a generic interface around SQL (or SQL-like) databases.

> The sql package must be used in conjunction with a database driver. See
> https://golang.org/s/sqldrivers for a list of drivers.

> Drivers that do not support context cancellation will not return until after
> the query is completed.

# https://deno.land/x/sql-tag

```ts
import {
  SQLRequest,
  UnknownDialect,
} from "https://deno.land/x/sql-interface/mod.ts";
import { SQL } from "https://deno.land/x/sql-tag/mod.ts";

const request: SQLRequest<UnknownDialect> = SQL`hello world`;
```

# https://deno.land/x/sqlite

```ts
import { SQLRequest } from "https://deno.land/x/sql-interface/mod.ts";
import { SQL, SQLiteDialect } from "https://deno.land/x/sqlite/mod.ts";

const request: SQLRequest<SQLiteDialect> = SQL`hello world`;
```
