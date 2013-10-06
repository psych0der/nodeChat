var socket = io.connect();
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
function setPseudo() {
	if ($("#pinput").val() != "")
	{
		socket.emit('setPseudo', $("#pinput").val());
		$('#chatControls').show();
		$('#pinput').hide();
		$('#pset').hide();
	}
}
socket.on('message', function(data) {
	addMessage(data['message'], data['pseudo']);
});

$(function() {
	$("#chatControls").hide();
	$("#pset").click(function() {setPseudo()});
	$("#submit").click(function() {sendMessage();});
});