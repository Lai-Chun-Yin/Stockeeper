module.exports = class UserService{
    constructor(knex){
        this.knex = knex;
    }

    verifyUserByEmail(email){
        return this.knex.select('id').from('users').where({email:email});
    }
}