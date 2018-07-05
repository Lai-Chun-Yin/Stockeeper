
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users',(table)=>{
        table.increments();
        table.string("email").unique().notNullable();
        table.string("password");
        table.string("name");
        table.timestamps(false,true);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
