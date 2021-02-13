# [x/sql-interfaces](https://deno.land/x/sql-interfaces)

A collection of generic interface for SQL databases in Deno. Typically used through a compatible database driver library such as:

- [x/sqlite](https://deno.land/x/sqlite)

```ts
// sql-interfaces@1.0.0

import {
  SQLDatabase,
  // just a reference to a database, possibly without a connection?
  // probably omit this for v0.
  // do we actually want this in v0?
  
  SQLRequest,
  SQLResponse,

  SQLDialect,

  SQLConnection,
  SQLConnectionSync,  
} from "https://deno.land/x/sql-interfaces";
```

Very loosely inspired by [Go's standard library database/sql package](https://pkg.go.dev/database/sql):