const [src, dest] = Deno.args;

const wasm = await Deno.readFile(src);

function encode(bytes: Uint8Array) {
  const lines = [];
  for (let offset = 0; offset < bytes.length; offset += 60) {
    lines.push(btoa(String.fromCodePoint(...bytes.slice(offset, offset + 60))));
  }
  return lines.join("\n");
}

await Deno.writeFile(
  dest,
  new TextEncoder().encode(`\
import env from "./vfs.ts";

const wasm = \`
${encode(wasm)}
\`;

function decode(base64: string) {
  const bytesStr = atob(base64);
  const bytes = new Uint8Array(bytesStr.length);
  for (let i = 0; i < bytesStr.length; i++) {
    bytes[i] = bytesStr.codePointAt(i)!;
  }
  return bytes;
}

const module = new WebAssembly.Module(decode(wasm));

// Create WASM instance, seed random number generator, and set local time zone.
export default function instantiate(): WebAssembly.Instance {
  const placeholder = { exports: null } as any;
  const instance = new WebAssembly.Instance(module, env(placeholder)) as any;
  placeholder.exports = instance.exports;
  instance.exports.seed_rng(Date.now());
  instance.exports.set_tz_utc_offset(new Date().getTimezoneOffset() / 60);
  return instance;
}
`),
);
