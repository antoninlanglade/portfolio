module.exports = ({ file, options, env }) => ({
  plugins: {
    'autoprefixer': {},
    'cssnano': {},
    'postcss-nested': {},
    'postcss-css-variables': {},
    'postcss-import': { root: file.dirname }
  }
})
