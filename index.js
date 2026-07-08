const Koa = require('koa');

//koa 实例
const app = new Koa();

//启动服务
try {
  const port = process.env.PORT || 8080;
  const host = process.env.IP || '0.0.0.0';
  app.listen(port, host)
  console.log(`Server runnin on port: ${port}`);
} catch (e) {
  console.error(e);
}

