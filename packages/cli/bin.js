#!/usr/bin/env node

const cli = require("@otox/cli-helper");
// @ts-ignore
const otox = require("@otox/core");

const c = cli.parseWithOptions(process.argv, {
  help: "h",
  version: "v",
});

// @ts-ignore
if (c.options.help) {
  console.log(`
  Usage:
    otox [command] --port=<port>

  Options:
    -h, --help
    -v, --version
  `);
  // @ts-ignore
} else if (c.options.version) {
  console.log(`cli: ${require("./package.json").version}`);
  // @ts-ignore
  console.log(`otox: ${require("./package.json").dependencies.otox}`);
} else {
  // @ts-ignore
  if (!c.options.port) {
    console.log(`[ERROR] port is required!`);
    process.exit(1);
  }
  // @ts-ignore
  otox(c.options.port, c.command, c.params);
}
