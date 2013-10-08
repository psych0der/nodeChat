
var socket = io.connect(window.location.origin,{
 'sync disconnect on unload': true
});

socket.emit('addUser','');

socket.on('message', function(packet)
{

	if($("#" + packet.from).length == 0) {

	$('#threads').append('<a href="/threads/"'+packet.from+'><li id="'+packet.from+'">'+packet.from+'</li></a>');
  
    }
	
});

