
const Router = require('koa-router');
const router = new Router();
const chalk = require('chalk');
const getData = require('./api');

const { enableLocalServerRender } = require('../config/constant');

router.get('/', async (ctx, next) => {
  const assets = require('../tmpDist/assets.json');
  const entryJs = assets['home'] && assets['home']['js'] || '';
  const entryCss = assets['home'] && assets['home']['css'] || '';
  const prefetchedData = { framework: 'koa' };
  console.log(chalk.red('### getData %s'), getData());
  let reactString;
  if (process.env.NODE_ENV === 'local' && !enableLocalServerRender) {
    reactString = '';
  } else {
    let basePath = '../tmpDist/';
    if(process.env.NODE_ENV === 'local') {
      basePath = '../';
    }
    const Home = require(basePath + 'client/component/Home');
    const React = require('react');
    const ReactDOM = require('react-dom/server');
    reactString = ReactDOM.renderToString(
      React.createElement(Home.default || '')
    );
  }
  await ctx.render('entry', {
    prefetchedData: JSON.stringify(prefetchedData),
    reactString,
    entryCss,
    entryJs
  });
});

module.exports = router;