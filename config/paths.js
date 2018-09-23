const path = require('path');
const fs = require('fs');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  dotenv: resolveApp('.env'),
  appSrc: resolveApp('src'),
  appPackageJson: resolveApp('package.json'),
  appIndexJs: resolveApp('src/app/index.tsx'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'),
  appStyles: resolveApp('src/app/styles')
}