const SocketRouter = require('../router/socketRouter');
const redis = require('redis');
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
  auth_pass: "thisisremoteserver"
});

const { generateMessage, generateLocationMessage } = require('../utils/message');

describe('Socket Router', function() {
  it('emit a message', function(done) {
    const io = jasmine.createSpyObj('io', ['emit']);

    const socket = {
      session: {
        passport: {}
      },
      user: 'ckc@ckc.com'
    }

    const socketRouter = new SocketRouter(io, redisClient);
    let inMessage = generateMessage(socket.user, 'hihi');

    socketRouter.onCreateMessage(socket, inMessage, socket.user, () => {
      expect(io.emit).toHaveBeenCalledWith('newMessage', inMessage);
      done();
    })
  })
})