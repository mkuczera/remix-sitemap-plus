import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "lib/module/index.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "lib/commonjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [resolve(), commonjs(), typescript(), json()],
};
