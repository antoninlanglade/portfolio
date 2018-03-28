const path = require('path');

module.exports = {
  root: path.join(__dirname, '../'),
  app: path.join(__dirname, '..', 'app'),
  build: path.join(__dirname, '../build'),
  assets: path.join(__dirname, '../assets'),
  webpack: __dirname,
  scripts: path.join(__dirname, '../scripts')
};
