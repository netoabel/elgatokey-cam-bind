import yargs from "yargs/yargs";

export function parseArgv(): any {
  return yargs(process.argv.slice(2))
    .options({
      toggle: { type: "boolean" },
      brightness: { type: "number" },
    })
    .parseSync();
}
