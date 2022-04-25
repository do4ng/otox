import { join } from "path";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";

const base = {
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
    commonjs({ extensions: [".js", ".ts"] }),
  ],
  external: ["@otox/cli-helper", "@otox/core", "@otox/saver"],
};

const cfg = (input, output) => {
  input = join(__dirname, input);
  return {
    ...base,
    input,
    output: [
      {
        file: `${output}.cjs.js`,
        format: "cjs",
      },
      {
        file: `${output}.esm.js`,
        format: "esm",
      },
    ],
  };
};

const configs = [];

configs.push(
  cfg("./packages/otox-core/src/index.ts", "./packages/otox-core/dist/index")
);

console.log(JSON.stringify(configs));

export default configs;
