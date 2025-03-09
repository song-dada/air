const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://kkms4001.iptime.org:21168',
      changeOrigin: true,
    })
  );
};
