
exports.up = function(knex, Promise) {
  return knex.schema.table('transactions',(table)=>{
    table.foreign('asset_symbol').references('assets.asset_symbol');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('transactions',(table)=>{
      table.dropForeign('asset_symbol');
  })
};
