function autoScroll()
{
var objDiv = document.getElementById("chat-box");
objDiv.scrollTop = objDiv.scrollHeight;
}

var socket = io.connect(window.location.origin,{
 'sync disconnect on unload': true
});

socket.emit('addUser','');
socket.emit('seen',to);

socket.on('chat message',function(packet){

if(packet.from == to)
{
var dt = new Date(packet.date);
dt = dt.getHours()+':'+dt.getMinutes();
$('#chat-box').append('<li> '+packet.from+' : '+packet.message+' <span class="pull-right xsmall"><small><i>'+dt+'</i></small></span></li>');
socket.emit('seen',to);
autoScroll();
}
});


$(document).ready(function(){


$(document).keypress(function(e){
    if(e.which == 13) {
      	
      	if( $('#chat').val() != '')
		{
        		socket.emit('chat message',{to : to, message : $('#chat').val()});
        		var date = new Date();
        		date = date.getHours()+':'+date.getMinutes();
        		$('#chat-box').append('<li id="me"> me : '+$('#chat').val()+' <span class="pull-right xsmall"><small><i>'+date+'</i></small></span></li>');
        		$('#chat').val('');
        		autoScroll();
        }
        
        

    }
});


autoScroll();	


});

