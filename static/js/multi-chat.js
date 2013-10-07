var socket = io.connect(window.location.origin,{
 'sync disconnect on unload': true
});
socket.emit('addUser','');

socket.on('new-user',function(nick){

$('#users').append('<li id="'+nick+'" class="user"><input type="checkbox" value="'+nick+'" class="user-add">&nbsp;&nbsp;'+nick+'</li>');

});

socket.on('other-users',function(userList){

	for(nick in userList)
	{
		$('#users').append('<li id="'+nick+'" class="user"><input type="checkbox" value="'+nick+'" class="user-add">&nbsp;&nbsp;'+nick+'</li>');

	}

});

socket.on('remove-user',function(nick){
	alert('called');
$('#'+nick).remove();

});

/*
function addMessage(msg, pseudo) {
	$("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}
function sendMessage() {
	if ($('#messageInput').val() != "") 
	{
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
		$('#messageInput').val('');
	}
}
function setNick() {
	if ($("#nick").val() != "")
	{
		socket.emit('addUser', $("#nick").val());
		$('#chatControls').show();
		$('#nick').hide();
		$('#set-nick').hide();
	}
}
socket.on('message', function(data) {
	addMessage(data['message'], data['user']);
});

function disconnect() {

	socket.emit('endSession');
	window.location = '/';
}

socket.on('updateUsers' , function(data) {

	$('#users').empty();

		for(user in data)
		{

		$('#users').append('<li>'+user+'</li>');
		}

});

*/

$(function() {
	/*$("#chatControls").hide();
	$("#set-nick").click(function() {setNick()});
	$("#submit").click(function() {sendMessage();});
	$("#exit").click(function(){ disconnect();});*/
});