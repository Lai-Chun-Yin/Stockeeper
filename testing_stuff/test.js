const PortfolioService = require('../utils/PortfolioService');
const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);

(() => {
  let ps = new PortfolioService(knex);
  let portfolios = ps.listPortfolios(1);
  console.log(portfolios);
})()
