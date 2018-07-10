module.exports = class PortfolioService {
    constructor(knex) {
        this.knex = knex;
    }

    listPortfolios(userId){
        let query = this.knex.select("id","name").from("portfolios")
        .where("user_id",userId);
        return query;
    }

    listStockinP(userId,porfolioId){
        
    }
}