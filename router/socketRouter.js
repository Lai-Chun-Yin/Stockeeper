const { generateMessage, generateLocationMessage } = require('../utils/message');

class SocketRouter {
  constructor(io, redisClient, chatroomName) {
    this.io = io;
    this.redisClient = redisClient;
    if (chatroomName != null) {
      this.chatroomName = chatroomName;
    }
  }

  router() {
    this.io.on('connection', (socket) => {
      // e.g. if email is ckc@gmail.com, user alias is ckc
      let userAlias = socket.user.split("@")[0];

      console.log(`New user - ${socket.user} - connected`);

      this.onConnect(socket, userAlias);

      socket.on('disconnect', () => {
        this.onDisconnect(userAlias);
      });

      socket.on('createMessage', (inMessage, cb) => {
        this.onCreateMessage(socket, inMessage, userAlias);
      });
    });
  }

  onConnect(socket, userAlias) {
    // console.log('print socket.session:', socket.session);
    // console.log('print socket.user:', socket.user);
    this.redisClient.lrange('activeUsers', 0, -1, async (err, results) => {
      // if == -1, user does not exist, add to list
      if (results.indexOf(userAlias) == -1) {
        await this.redisClient.lpush('activeUsers', userAlias);
        results.push(userAlias);
      }

      this.io.emit('refreshUserList', results);
    });

    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app!"));
    socket.broadcast.emit('newMessage', generateMessage("Admin", "New user joined"));
  }

  onDisconnect(userAlias) {
    console.log(userAlias, 'left us');
    // remove user from list
    this.redisClient.lrem('activeUsers', 1, userAlias, () => {
      this.redisClient.lrange('activeUsers', 0, -1, (err, results) => {
        this.io.emit('refreshUserList', results);
      });
    });
  }

  onCreateMessage(socket, msg, userAlias, cb) {
    
    console.log(`${socket.user}: ${msg.text}`)
    this.io.emit('newMessage', generateMessage(userAlias, msg.text));
    if (cb != null) {
      cb();
    }
  }
}

module.exports = SocketRouter;