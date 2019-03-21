const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

const app = express();
const setupPassport = require('./utils/passport');
const bodyParser = require('body-parser');
const router = require('./router/viewRouter')(express);
const hbs = require('express-handlebars');

const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 8080;

// New Route Methods
const StockRouter = require('./router/StockRouter');
const StockService = require('./utils/StockService');
const PortfolioService = require('./utils/PortfolioService');
const PortfolioRouter = require('./router/PortfolioRouter');
const TransactionRouter = require('./router/TransactionRouter');
const TransactionService = require('./utils/TransactionService');
const UserRouter = require('./router/UserRouter');
const UserService = require('./utils/UserService');

// Redis session stuff
const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  auth_pass: "thisisremoteserver"
});

const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);

const sessionStore = new RedisStore({
  client: redisClient,
  unset: "destroy"
});
const settings = {
  store: sessionStore,
  secret: "supersecret",
  cookie: { "path": '/', "httpOnly": true, "secure": false, "maxAge": null }
}

// Socket IO stuff
const server = http.createServer(app);
const io = socketIO(server);
const socketIOSession = require('socket.io.session');

app.use(expressSession(settings));

app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const passportUtil = setupPassport(app);

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'metro' }));
app.set('view engine', 'hbs');
app.use(express.static(publicPath));
app.locals.siteTitle = 'Stockeeper';

// Old route method
app.use('/', router);

// New route method
let ps = new PortfolioService(knex);
let ss = new StockService(knex);
let ts = new TransactionService(knex);
let us = new UserService(knex);
app.use('/api/transaction', (new TransactionRouter(ts)).router());
app.use('/api/portfolio', (new PortfolioRouter(ps)).router());
app.use('/api/stock', (new StockRouter(ss)).router());
app.use('/api/user', (new UserRouter(us)).router());

//Socket io - chat room
io.use(socketIOSession(settings).parser);
io.use((socket, next) => {
  if (!socket.session.passport) {
    socket.disconnect();
  } else {
    passportUtil.deserializeUser(socket.session.passport.user, (err, user) => {
      socket.user = user;
      next();
    });
  }
});

const SocketRouter = require('./router/socketRouter');
const socketRouter = new SocketRouter(io, redisClient)
socketRouter.router();

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
