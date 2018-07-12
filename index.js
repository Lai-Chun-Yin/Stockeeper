const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

const app = express();
const session = require('express-session');
const setupPassport = require('./utils/passport');
const bodyParser = require('body-parser');
const router = require('./router/viewRouter')(express);
const hbs = require('express-handlebars');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 8080;
var server = http.createServer(app);
var io = socketIO(server);

// New Route Methods
const StockRouter = require('./router/StockRouter');
const StockService = require('./utils/StockService');
const PortfolioService = require('./utils/PortfolioService');
const PortfolioRouter = require('./router/PortfolioRouter');

app.use(session({
  secret: 'supersecret'
}));

app.use(bodyParser());

setupPassport(app);

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'metro' }));
app.set('view engine', 'hbs');
app.use(express.static(publicPath));
app.locals.siteTitle = 'Stockeeper';

// Old route method
app.use('/', router);

// New route method
let ps = new PortfolioService(knex);
let ss = new StockService(knex);
app.use('/api/portfolio', (new PortfolioRouter(ps)).router());
app.use('/api/stock',(new StockRouter(ss)).router());

//Socket io - chat room
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app!"));
  socket.broadcast.emit('newMessage', generateMessage("Admin", "New user joined"));

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('createMessage', (inMessage, callback) => {
    console.log(`${inMessage.from}: ${inMessage.text}`)
    io.emit('newMessage', generateMessage(inMessage.from, inMessage.text));
    callback();
  });

});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
