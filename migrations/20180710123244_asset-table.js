
exports.up = function(knex, Promise) {
    return knex.schema.createTable('assets',(table)=>{
        table.string("asset_symbol").notNullable().primary();
        table.decimal('current_price',8,3);
        table.integer("quantity_per_hand");
        table.string('name');
        table.timestamps(false,true);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('assets');
};
