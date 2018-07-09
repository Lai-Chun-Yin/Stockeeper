const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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
const stockRouter = require('./router/StockRouter');
const portfolioService = require('./public/js/portfolioService');

app.use(session({
  secret: 'supersecret'
}));

app.use(bodyParser());

setupPassport(app);

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'metro' }));
app.set('view engine', 'hbs');
app.use(express.static(publicPath));

// Old route method
app.use('/', router);

// New route method
let ps = new portfolioService('./portfolioService.js');
app.use('/portfolio', (new stockRouter('portfolio')).router());
app.get('/portfolio', function(res, req){
  res.render('portfolio');
})

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
