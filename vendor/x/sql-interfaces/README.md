# [x/sql-interfaces](https://deno.land/x/sql-interfaces)

A generic interface for SQL databases in Deno. Typically used with a
compatible database driver library such as:

- [x/sqlite](https://deno.land/x/sqlite)

Loosely modeled after [Go's standard library database/sql package](https://pkg.go.dev/database/sql):

> Package `sql` provides a generic interface around SQL (or SQL-like) databases.
>
> The sql package must be used in conjunction with a database driver. See https://golang.org/s/sqldrivers for a list of drivers.
> 
> Drivers that do not support context cancellation will not return until after the query is completed.

