# [x/sql-strings](https://deno.land/x/sql-strings)

`SQLString` is a generic implementation of the `SQLRequest` interface from
[`x/sql-interfaces`](https://deno.land/x/sql-interfaces) for SQL expressions
with bound parameters, exposed as a <code>SQL&#96;SELECT Example…&#96;</code>
string tag function.

By default this will produces instances of `SQLRequest<AnyDialect>`, or a more
specific `SQLDialect` may be specified explicitly.

```ts
import {
  AnyDialect,
  SQLDialect,
  SQLRequest,
  UnknownDialect,
} from "https://deno.land/x/sql-interfaces/mod.ts";

import { SQL } from "https://deno.land/x/sql-strings/mod.ts";

const targetId = 2;

const whereCondition = SQL`Id = ${targetId}`;
const resultColumns = SQL`Name`;

const request = SQL<AnyDialect>`
  SELECT ${resultColumns}
  FROM Users
  WHERE ${whereCondition}
`;

request.sql === `
  SELECT Name
  FROM Users
  WHERE Id = ?
`;
result.parameters === [
  2,
];
```

Some drivers libraries may re-export the `SQL` tag function specialized for
their dialect. For example, if you import `SQL` from `x/sqlite`, it will be
produce strings of type `SQLRequest<sqlite.Dialect>` instead, which will be
rejected as potentially incompatible by other drivers.
