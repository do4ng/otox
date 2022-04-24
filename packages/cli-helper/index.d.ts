interface Out {
  command: string;
  params: string[];
  options: object;
}

/**
 * parse args
 *
 * ```js
 * // = parse(process.argv);
 * parse(['node', 'index.js', 'foo', 'bar', '--ping=pong', '--help', '-h']);
 * // => { command: 'foo', params: ['bar'], options: { ping: 'pong', help: true, h: true } }
 * ```
 *
 * @param args args like process.argv
 */
export function parse(args: string[]): Out;

/**
 * parse args with options
 * ```js
 * // = parseWithOptions(process.argv, { help: 'h' });
 * parseWithOptions(['node', 'index.js', 'foo', 'bar', '--ping=pong', '--help', '-h'], { help: 'h' });
 * // => { command: 'foo', params: ['bar'], options: { ping: 'pong', help: true } }
 * ```
 * @param args args like process.argv
 * @param options custom options
 */
export function parseWithOptions(args: string[], options: object): Out;
