const Koa = require('koa');
const chalk = require('chalk');
const views = require('koa-views');
const koaStatic = require('koa-static');
const webpack = require('webpack');
const koaWebpack = require('koa-webpack');

const config = require('../config/webpack.config.local.js');
const { enableLocalServerRender } = require('../config/constant');

const app = new Koa();

const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('server error', err);
    ctx.response.status = e.statusCode || e.status || 500;
  }
}

app.use(handler);

app.use(koaStatic('static'));

if (process.env.NODE_ENV === 'local') {
  const compiler = webpack(config);
  koaWebpack({ compiler, hotClient: { port: 55756 } })
    .then((middleware) => {
      app.use(middleware);
    }, err => {
      console.log(err)
    });
  //use babel to transform client code for server rendering
  if (enableLocalServerRender) {
    require("babel-register")({
      extensions: [".jsx", ".js"],
      plugins: ["ignore-html-and-css-imports"],
      cache: false
    });
    require('hot-node-module-replacement')({
      extenstions: ['.js', '.jsx']
    });
  }
}

app.use(views('.//static/view', {
  extension: 'pug'
}));

const router = require('./router');
app.use(router.routes());

const port = process.env.PORT || 3006;
const host = process.env.IP || 'localhost';

app.listen(port, host, () => {
  console.info(chalk.red('==> ✅  Server is listening on %s:%d'), host, port);
});