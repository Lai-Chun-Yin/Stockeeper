var socket = io();

// var messageTemplate = $('#message-template').html();
var templateScript = Handlebars.compile(`
  <li class="message">
      <div class="message__title">
        <h4> {{from}}</h4>
        <span> {{createdAt}}</span>
      </div>
      <div class="message__body">
        <p> {{text}}</p>
      </div>
    </li>
`);
var addMessage = function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var html = templateScript({
    "text":message.text,
    "from":message.from,
    "createdAt":formattedTime
  });
  
  $('#messages').append(html);
}
var reloadMessages = function(messages){
  messages.forEach(function(message){
    addMessage(message);
  })
}

function scrollToBottom(){
  //Selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  console.log('Connected to server');

});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage',function(message){
  console.log(message);
  addMessage(message);
  scrollToBottom();
});

$('#message-form').on('submit',function(e){
  e.preventDefault();

  socket.emit('createMessage',{
    from: "User",
    text: $('[name=message]').val()
  },function(){
    $('[name=message]').val("");
  });
});
