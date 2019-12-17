import sqlite from "./build/sqlite.js";
import { DB } from "./src/db.js";
import { Empty } from "./src/row.js";

/**
 * Open a new SQLite3 database. Each database is
 * running in a separate WASM instance. This
 * returns a promise resolving to the database.
 *
 * If a file path is provided, then the database
 * is initialized with the data from the file.
 */
function open(path?: string): Promise<DB> {
  return new Promise((accept, reject) => {
    if (!path) {
      accept();
    } else {
      Deno.readFile(path)
        .then(file => {
          accept(file);
        })
        .catch(reject);
    }
  }).then(file => {
    return new Promise(accept => {
      sqlite().then(inst => accept(new DB(inst, file)));
    });
  });
}

export { open, Empty };
