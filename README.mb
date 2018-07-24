Stockeeper

At Stockeeper, you get free stock quotes, up-to-date news, portfolio management resources, Hong Kong market data and social interaction that help you manage your financial life.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Install PostgreSQL, Redis, NodeJS

```
sudo apt-get install postgresql postgresql-contrib
```

### Installing

Create database "stockeeper" in your local PostgreSQL environment

```
sudo service postgresql start
sudo su postgres
createdb stockeeper
```

Run Redis in the background
```
redis-server --daemonize yes
```

Navigate to the application's root directory. Run Knex migration and seed files to setup tables and populate stock reference data.

```
knex migrate:latest
knex seed:run
```

To start the applicaion, run:

```
node index.js
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [NodeJS](https://nodejs.org/) - The web framework used
* [PostgreSQL](https://www.postgresql.org/) - Database System
* [Redis](https://redis.io/) - in-memory data structure store
* [JQuery](https://api.jquery.com/)
* [Express Handlebars](https://github.com/ericf/express-handlebars)
* [D3.js](https://d3js.org/) - JavaScript library that helps visualize data
* [Socket.io](https://socket.io/)

## Authors

* **CK Chan**
* **Tommy Lai**
* **Peter Wong**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
