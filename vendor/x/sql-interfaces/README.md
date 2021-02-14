# [x/sql-interfaces](https://deno.land/x/sql-interfaces)

We will follow semver, but with interfaces most changes constitute "major"
breaks for either users or implementers so there may not be very many "minor"
releases.

A collection of generic interface for SQL databases in Deno. Typically used
through a compatible database driver library such as:

- [`x/sqlite`](https://deno.land/x/sqlite)

```ts
// sql-interfaces@1.0.0

import {
  SQLConnection,
  SQLConnectionSync,
  SQLDatabase,
  SQLDialect,
  SQLRequest,
  SQLResponse,
} from "https://deno.land/x/sql-interfaces";
```

Very loosely inspired by
[Go's standard library database/sql package](https://pkg.go.dev/database/sql):
