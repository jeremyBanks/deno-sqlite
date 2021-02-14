`database` provides an abstract interface for SQL databases in Deno, inspired by
[Go's standard `database/sql` package](https://pkg.go.dev/database/sql).

We will follow semver, but with interfaces most changes constitute "major"
breaks for either users or implementers so there may not be very many "minor"
releases.

A collection of generic interface for SQL databases in Deno. Typically used
through a compatible database driver library such as:

- [`x/sqlite`](https://deno.land/x/sqlite)

```ts
export default {
  
}

export default {
  Driver,
  Connecter,         // --> Queryer
  ConnecterSync,     // --> QueryerSync
  Queryer,           // --> 
  QueryerSync,       // -->
  QueryStringer,     // -->
  QueryParameterser, // -->
  DialectNamer,      //
  DriverTyper,
} from "https://deno.land/x/sqls/interfaces.ts";

import {
  Database,
  Connection,
  ConnectionSync,
} from "https://deno.land/x/sqls/abstract.ts";


type InnerDatabase = Queryer | QueryerSync;
abstract class Database<Inner extends InnerDatabase> {
  constructor(readonly inner: Inner) {
    
  }
}


// https://golang.org/src/database/sql/driver/driver.go

import * as sqls from "https://deno.land/x/sqls/mod.ts";

sqls.open
```

Very loosely inspired by
[Go's standard library database/sql package](https://pkg.go.dev/database/sql):
