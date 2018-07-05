const {generateMessage,generateLocationMessage} = require('../server/utils/message');

describe('generateMessage',()=>{
    it('should generate correct message object',()=>{
        message=generateMessage('annoying man','hello world')
        expect(message.from).toEqual('annoying man');
        expect(message.text).toEqual('hello world');
        expect(typeof message.createdAt).toEqual('number');
    });

    it('should generate correct location message object',()=>{
        message=generateLocationMessage('fish',1,1)
        expect(message.from).toEqual('fish');
        expect(message.url).toEqual('https://www.google.com/maps?q=1,1');
        expect(typeof message.createdAt).toEqual('number');
    })
})