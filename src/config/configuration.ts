export default () => ({
  port: parseInt(process.env.PORT, 10) || 7777,
  swaggerTheme: process.env.SWAGGER_THEME,
  database: {
    HOST: process.env.DB_HOST,
    PORT: parseInt(process.env.DB_PORT, 10),
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
  },
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  cookieSecret: process.env.COOKIE_SECRET
});
