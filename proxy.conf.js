const target = process.env['BACKEND_URL'] || 'http://localhost:5000';

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
};
