const PortfolioService = require('../utils/PortfolioService');
const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);

  let portfoList = [];
  let ps = new PortfolioService(knex);
  ps.listPortfolios(1).then((result) => {
    portfoList = result;
  });

  console.log('testing');
  console.log(portfoList);
