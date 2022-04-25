# @otox/cli-helper

process.argv parser

## usage

```js
#!/usr/bin/env node

const helper = require("@otox/cli-helper");

helper.parse(process.argv);
// => { command: 'foo', params: ['bar'], options: { help: true, h: true } }

helper.parseWithOptions(process.argv, { help: "h" });
// => { command: 'foo', params: ['bar'], options: { help: true } }
```

```bash
$ node index.js foo bar --help -h
```
