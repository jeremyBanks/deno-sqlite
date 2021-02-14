// https://golang.org/src/database/sql/driver/driver.go

export type QueryOptions<Dialect> = {
  abortSignal?: AbortSignal;
};
