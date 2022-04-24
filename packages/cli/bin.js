#!/usr/bin/env node

const cli = require("@otox/cli-helper");
const otox = require("otox");

const c = cli.parseWithOptions(process.argv, {
  help: "h",
  version: "v",
});

if (c.options.help) {
  console.log(`
  Usage:
    otox [command] --port=<port>

  Options:
    -h, --help
    -v, --version
  `);
} else if (c.options.version) {
  console.log(`cli: ${require("./package.json").version}`);
  console.log(`otox: ${require("./package.json").dependencies.otox}`);
} else {
  if (!c.options.port) {
    console.log(`[ERROR] port is required!`);
    process.exit(1);
  }
  otox(c.options.port, c.command, c.params);
}
