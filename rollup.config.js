const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;
const terser = require('@rollup/plugin-terser');

const isPreview = process.env.BUILD === 'preview';

module.exports = {
  input: 'src/index.js',
  output: {
    file: isPreview ? 'dist/apps.bundle.js' : 'dist/apps.bundle.min.js',
    format: 'iife',
    name: 'SPApps',
    sourcemap: isPreview
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
