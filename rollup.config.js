import typescript from '@rollup/plugin-typescript';

module.exports = /** @type {import('rollup').RollupOptions} */ ({
  input: './src/index.ts',
  output: {
    dir: './dest/',
    sourcemap: true,
  },
  plugins: [
    typescript(),
  ],
});
