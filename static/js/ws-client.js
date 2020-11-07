var stompClient = null;
var selectedClient = null;
var clientName = $("#from").val();

const chatServer = "http://localhost:8080";
//connect(loggedInUser.email);

function setConnected(connected) {
    $("#from").prop("disabled", connected);
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#users").show();
        $("#sendmessage").show();
    } else {
        $("#users").hide();
        $("#sendmessage").hide();
    }
}

function connect() {
    clientName = $("#from").val();
    //check if username is set
    if (clientName == null || clientName === "") {
        alert('Please input a nickname!');
        return;
    }
    //connect user
    $.post(chatServer + '/api/chat/user-connect',
        { username: clientName },
        function (remoteAddr, status, xhr) {
            var socket = new SockJS( chatServer + '/chat');
            stompClient = Stomp.over(socket);

            stompClient.connect({ username: clientName }, function () {
                stompClient.subscribe('/topic/broadcast', function (output) {
                    showMessage(createTextNode(JSON.parse(output.body)));
                });

                stompClient.subscribe('/topic/active', function () {
                    updateUsers(clientName);
                });

                stompClient.subscribe('/user/queue/messages', function (output) {
                    showMessage(createTextNode(JSON.parse(output.body)));
                });

                sendConnection(' connected to server');
                setConnected(true);
            }, function (err) {
                alert('error' + err);
            });

        }).done(function () {
            // alert('Request done!');
        }).fail(function (jqxhr, settings, ex) {
            console.log('failed, ' + ex);
        }
        );
}

function disconnect() {
    if (stompClient != null) {
        $.post(chatServer + '/api/chat/user-disconnect',
            { username: clientName },
            function () {
                sendConnection(' disconnected from server');

                stompClient.disconnect(function () {
                    console.log('disconnected...');
                    setConnected(false);
                });

            }).done(function () {
                // alert('Request done!');
            }).fail(function (jqxhr, settings, ex) {
                console.log('failed, ' + ex);
            }
            );
    }
}

function sendConnection(message) {
    var text = clientName + message;
    sendBroadcast({ 'from': 'server', 'text': text });

    // for first time or last time, list active users:
    updateUsers(clientName);
}

function sendBroadcast(json) {
    stompClient.send("/app/broadcast", {}, JSON.stringify(json));
}

function send() {
    var text = $("#message").val();
    if (selectedClient == null) {
        alert('Please select a user.');
        return;
    }
    stompClient.send("/ws/chat", { 'sender': clientName },
        JSON.stringify({ 'from': clientName, 'text': text, 'recipient': selectedClient }));
    $("#message").val("");
}

function createTextNode(messageObj) {
    var classAlert = 'alert-info';
    var fromTo = messageObj.from;
    var addTo = fromTo;

    if (clientName == messageObj.from) {
        fromTo = messageObj.recipient;
        addTo = 'to: ' + fromTo;
    }

    if (clientName != messageObj.from && messageObj.from != "server") {
        classAlert = "alert-warning";
    }

    if (messageObj.from != "server") {
        addTo = '<a href="javascript:void(0)" onclick="setSelectedUser(\'' + fromTo + '\')">' + addTo + '</a>'
    }
    return '<div class="row alert ' + classAlert + '"><div class="col-md-8">' +
        messageObj.text +
        '</div><div class="col-md-4 text-right"><small>[<b>' +
        addTo +
        '</b> ' +
        messageObj.time +
        ']</small>' +
        '</div></div>';
}

function showMessage(message) {
    $("#content").html($("#content").html() + message);
    $("#clear").show();
}

function clearMessages() {
    $("#content").html("");
    $("#clear").hide();
}

function setSelectedUser(username) {
    selectedClient = username;
    $("#selectedUser").html(selectedClient);
    if ($("#selectedUser").html() == "") {
        $("#divSelectedUser").hide();
    } else {
        $("#divSelectedUser").show();
    }
}

function updateUsers(userName) {
    // console.log('List of users : ' + userList);
    var activeUserSpan = $("#active-users-span");
    var activeUserUL = $("#active-users");

    var index;
    activeUserUL.html('');

    var url = chatServer + '/api/chat/active-users-except/' + userName;
    $.ajax({
        type: 'GET',
        url: url,
        // data: data,
        dataType: 'json', // ** ensure you add this line **
        success: function (userList) {
            if (userList.length == 0) {
                activeUserSpan.html('<p><i>No active users found.</i></p>');
            } else {
                activeUserSpan.html('<p class="text-muted">click on user to begin chat</p>');

                for (index = 0; index < userList.length; ++index) {
                    if (userList[index] != userName) {
                        activeUserUL.html(activeUserUL.html() + createUserNode(userList[index], index));
                    }
                }
                /*
                $.each(userList, function(index, item) {
                    //now you can access properties using dot notation
                });
                */
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("error occurred");
        }
    });
}

function createUserNode(username, index) {
    return '<li class="list-group-item">' +
        '<a class="active-user" href="javascript:void(0)" onclick="setSelectedUser(\'' + username + '\')">' + username + '</a>' +
        '</li>';
}
