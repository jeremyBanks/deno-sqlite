import { WithTypes } from "../sql/driver.ts";

export const types: WithTypes<{
    sqlDialectName: "sqlite",
}> = {};

export const open = (): Connection => {
  return new Connection();
};

export class Connection {
  querySync() {
    return 2;
  }
}
