import path from 'path';

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
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
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api/': {
          target: 'https://qaapi.xinmai100.com',
          pathRewrite: {
            '^/api/': '/'
          },
          changeOrigin: true
        }
      }
    }
  }
};
