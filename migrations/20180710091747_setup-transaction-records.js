
exports.up = function(knex, Promise) {
    return knex.schema.createTable('transactions',(table)=>{
        table.increments();
        table.string("asset_symbol").notNullable();
        table.decimal('purchase_price',8,3).notNullable();
        table.integer("purchase_quantity").notNullable();
        table.boolean("buy_sell");
        table.integer('portfolio_id').unsigned();
        table.foreign('portfolio_id').references('portfolios.id');
        table.timestamp("transaction_time");
        table.timestamps(false,true);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('transactions');
};
