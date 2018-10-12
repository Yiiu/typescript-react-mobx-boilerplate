module.exports = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8000,
  build: '__server',
  clientBuild: '__server/client'
}