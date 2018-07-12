const csv=require('csvtojson');
const csvFilePath= (__dirname + '/hkex.csv');

exports.seed = async function(knex, Promise) {
  const jsonArray = await csv().fromFile(csvFilePath);
  // Deletes ALL existing HK stocks
  // In SQL: DELETE FROM assets WHERE asset_symbol like ('%.HK');
  return knex('assets').where('asset_symbol', 'like', '%.HK').del()
    .then(function () {
      // Inserts seed entries
      return knex('assets').insert(jsonArray);
    });
};


