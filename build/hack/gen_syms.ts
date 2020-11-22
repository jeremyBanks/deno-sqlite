// Generate available import symbols
// from vfs.ts file

import env from "../vfs.ts";

let symbols = "";
for (const symbol of Object.keys(env().env)) {
  symbols += `${symbol}\n`;
}
await Deno.writeFile(Deno.args[0], new TextEncoder().encode(symbols));
