import typescript from "rollup-plugin-typescript2";

const base = {
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ],
};

const cfg = (input, output) => {
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

configs.push(cfg("./packages/otox/src/index.ts", "./packages/otox/dist/index"));

console.log(JSON.stringify(configs));

export default configs;
