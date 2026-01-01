const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;
const terser = require('@rollup/plugin-terser');

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/apps.bundle.min.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-env', { targets: { ie: '11' } }]
      ]
    }),
    terser()
  ]
};
