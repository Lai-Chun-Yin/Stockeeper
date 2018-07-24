const moment = require('moment');

var generateMessage = (from,text)=>{
    return{
    from,
    text,
    // round the timestamp so that my jasmine test won't fail due to 1 milisecond difference =.=
    // see socket.spec.js
    createdAt: Math.round(moment().valueOf()/100,0) * 100
  };
}

var generateLocationMessage = (from,latitude,longitude)=>{
    return{
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports={generateMessage,generateLocationMessage};