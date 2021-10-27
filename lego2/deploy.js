/* eslint-disable import/no-commonjs */
const path = require('path');
const XmCdnSdk = require('./lib/xm-cdn-sdk');

const bundleDirName = path.resolve(path.join(__dirname, './dist'));

const xmCdnSdk = new XmCdnSdk({
  cdnDirName: 'xmLego',
  bundleDirName,
  env: process.env.NODE_ENV
});

xmCdnSdk.init();
