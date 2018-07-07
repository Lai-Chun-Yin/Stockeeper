const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const session = require('express-session');
const setupPassport = require('./utils/passport');
const bodyParser = require('body-parser');
const router = require('./router/viewRouter')(express);
const stockRouter = require('./router/StockRouter');
const hbs = require('express-handlebars');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 8080;
var server = http.createServer(app);
var io = socketIO(server);

// Service Components
const portfolioService = require('./public/js/portfolioService');

app.use(session({
  secret: 'supersecret'
}));

app.use(bodyParser());

setupPassport(app);

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');
app.use(express.static(publicPath));

// Old route method
app.use('/', router);
app.get('/auth', router);
app.get('/home', router);
app.get('/search', router);

// New route method
let ps = new portfolioService('./portfolioService.js');
console.log(ps.list());
app.get('/portfolio', function (req, res) {
  res.render('portfolio');
});
app.use('/portfolio', (new stockRouter('portfolio')).router());

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
