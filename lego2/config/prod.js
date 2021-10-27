import path from 'path';

const NODE_ENV = process.env.NODE_ENV === 'qa' ? '"qa"' : '"production"';

module.exports = {
  env: {
    NODE_ENV: NODE_ENV
  },
  defineConstants: {},
  mini: {},
  copy: {
    patterns: [
      {
        from: path.join(__dirname, '..', 'public/nginx_legoadmin'),
        to: 'dist/nginx_legoadmin'
      },
      { from: path.join(__dirname, '..', 'public/nginx_mt2'), to: 'dist/nginx_mt2' },
      { from: path.join(__dirname, '..', 'public/do_not_delete'), to: 'dist/do_not_delete' },
      { from: path.join(__dirname, '..', 'public/favicon.ico'), to: 'dist/favicon.ico' },
      { from: path.join(__dirname, '..', 'public/XePVXyYhLQ.txt'), to: 'dist/XePVXyYhLQ.txt' },
      { from: path.join(__dirname, '..', 'public/vvDQQrIMTD.txt'), to: 'dist/vvDQQrIMTD.txt' },
      {
        from: path.join(__dirname, '..', 'public/MP_verify_dp132KSl17g7u0Wh.txt'),
        to: 'dist/MP_verify_dp132KSl17g7u0Wh.txt'
      },
      { from: path.join(__dirname, '..', 'public/preLoading.png'), to: 'dist/preLoading.png' }
    ]
  },
  h5: {
    // publicPath: 'https://resource.xinmai100.com/xmLego',
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    enableExtract: true,
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].css'
    }
  }
};
