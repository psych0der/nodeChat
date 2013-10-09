/* size property */

function size(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


var socket = io.connect(window.location.origin,{
 'sync disconnect on unload': true
});

var selected = {};
var queue = {};
var notifications = 0;

socket.emit('addUser','');
socket.emit('fetch history');

socket.on('new-user',function(nick){


$('#users').append('<li id="'+nick+'" class="user"><input type="checkbox" value="'+nick+'" class="user-add">&nbsp;&nbsp;'+nick+'</li>');

});


socket.on('other-users',function(userList){

	for(nick in userList)
	{
		$('#users').append('<li id="'+nick+'" class="user"><input type="checkbox" value="'+nick+'" class="user-add">&nbsp;&nbsp;'+nick+'</li>');

	}

});

socket.on('history', function(history)
{
	

	history.forEach(function(doc){

	if(queue[doc.from]== undefined)
	{
	console.log('received');
	notifications+=1;
	$('#notification').text(String(notifications));
	queue[doc.from] = 1;

	}

	});
	
	
});

socket.on('message', function(packet)
{


	if(queue[packet.from]== undefined)
	{
	//alert('lol');
	notifications+=1;
	$('#notification').text(String(notifications));
	queue[packet.from] = 1;

	}
	else
	{
		//alert('double lol');
	}
	
});

socket.on('remove-user',function(nick){

$('#'+nick).remove();

});

function updateList(elem){
	
if(elem.checked) {
	//alert(elem.parentNode.id);
	selected[elem.parentNode.id]=1;
}

else
{
	delete selected[elem.parentNode.id];
}

//alert(JSON.stringify(selected));

}


function disconnect() {


socket.emit('endSession');
window.location = '/logout';

}


$(document).ready(function(){



$('#notification').text('0');

$(document).on("change", ".user-add", function(event) {

	updateList(event.target);
});

$(document).keypress(function(e) {
    if(e.which == 13) {
      	
      	if(size(selected) > 0 && $('#chat').val() != '')
        	socket.emit('send to all',{to : selected , message : $('#chat').val()});
        
       
        $('#chat').val('');

    }
});

});

