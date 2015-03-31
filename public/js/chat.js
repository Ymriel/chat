﻿var username = '';
var avatar = '/public/images/nico_yds.jpg';
if(localStorage.getItem("avatar") != null) {
    avatar = localStorage.getItem("avatar");
}

if(localStorage.getItem("username") != null) {
    username = localStorage.getItem("username");
}
else {
    setUsername();
}

var socket = io.connect('http://'+ip+':'+port);

socket.on('conn', function() {
    socket.emit('conn', username);
})

socket.on('message', function (data) {
    if(data.message == "/nsa") {
        sendFreedom(data.username);
        return;
    }
    document.getElementById("chat").innerHTML = constructMessage(data.avatar, data.username, data.message, data.time) + document.getElementById("chat").innerHTML
});

socket.on('sysmessage', function (data) {
    document.getElementById("chat").innerHTML = sysMessage(data) + document.getElementById("chat").innerHTML;
});

function send() {
    var time = Date.now();
    var data = { 'username': username, 'avatar': avatar, 'message': document.getElementById("message").value, 'time' : time };
    sendMessage(data);
    document.getElementById("message").value = "";

    document.getElementById('submit').disabled = true;
    setTimeout(function () { document.getElementById('submit').disabled = false; }, 500);
}

function sendMessage(data) {
    socket.emit('message', data);
}

function constructMessage(avatar, username, content, time) {
    var date = new Date(time);
    if(content == "/lenny")
        content = "( ͡° ͜ʖ ͡°)";

    var html = '';
    html += '<br />';
    html += '<div>';
    html += '<a href=\'' + avatar + '\' target="_blank" ><img class=\'avatar\' src=\'' + avatar + '\'/></a>';
    html += '<div><b class=\'pseudo\'>' + username + '</b>  ';
    html += '<span class=\'messageTime\'>' + (date.getHours() < 10 ? '0' : '') + date.getHours() + 'h' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + '</span><br />';
    html += '<span class=\'messageContent\' >' + content + '</span></div></div>';
    html += '</div>'
    html += '<hr class=\'endmessage\'/>';

    return html;
}

function sysMessage(data) {
    var date = new Date(Date.now());

    var html = '';
    html += '<br />';
    html += '<div>';
    html += '<span class=\'sysMessageContent\'>' + (date.getHours() < 10 ? '0' : '') + date.getHours() + 'h' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ' : ';
    html += data.username + ' entered the chat</span></div></div>';
    html += '</div>'
    html += '<hr class=\'endmessage\'/>';

    return html;
}

function setAvatar() {
    avat = prompt("Enter your avatar's url :");
    
    if (isEmptyOrSpaces(avat)) {
        avatar = '/public/images/nico_yds.jpg';
    }
    else {
        avatar = avat;
        localStorage.setItem("avatar", avat);
    }
}

function setUsername() {
    usern = prompt("Enter your username :");
    
    if(usern === "Poxymyr" || usern === "Vega"){
        passwd = prompt("This username is reserved ;) \nEnter the password :");
        if(CryptoJS.MD5(passwd) == "e86eb3868e5cb0e27f4822d1b30213e1"){
            username = usern;
            localStorage.setItem("username", usern);
        }
        else {
            alert("Wrong password biyotch!");
            setUsername();
        }
    }
    else if (!isEmptyOrSpaces(usern)) {
        username = usern;
        localStorage.setItem("username", usern);
    }
    else {
        username = 'I suck';
    }
}

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}