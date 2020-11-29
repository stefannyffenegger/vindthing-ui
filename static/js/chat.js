var stompClient = null;
var selectedUser = null;
var userName = $("#from").val();

const chatServer = "http://localhost:8080";
connect(userName);

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

function connectionSuccessSnackbar(){
  this.$nuxt.$buefy.snackbar.open("Chat connected!");
}

function connectionWarningSnackbar() {
  this.$nuxt.$buefy.snackbar.open({
    message: 'Chat connection lost!',
    type: 'is-warning',
    position: 'is-top',
    actionText: 'Retry',
    indefinite: true,
    queue: false,
    onAction: () => {
      connect();
    }
  })
}

function userSelectWarningSnackbar(msg) {
  this.$nuxt.$buefy.snackbar.open({
    message: msg,
    type: 'is-warning',
    position: 'is-top',
    queue: false
  })
}

function messageNotification(msg) {
  this.$nuxt.$buefy.notification.open({
    duration: 5000,
    message: msg,
    type: "is-info is-light",
    iconPack: "mdi",
    hasIcon: true,
    icon: "account",
    queue: false,
    position: 'is-bottom-right'
  })
}

/**
 * Connect to server and subscribe
 * @param userName
 */
function connect(userName) {
    //check if username is set
    if (userName == null || userName === "") {
        alert('Please input a nickname!');
        return;
    }
    //connect user
    $.post(chatServer + '/api/chat/user-connect',
        { username: userName },
        function (remoteAddr, status, xhr) {
            var socket = new SockJS( chatServer + '/chat');
            stompClient = Stomp.over(socket);

            stompClient.connect({ username: userName }, function () {
                //stompClient.subscribe('/topic/broadcast', function (output) {
                //    console.log("BROADCAST SUBSCRIBE");
                //    showMessage(createTextNode(JSON.parse(output.body)));
                //});

                stompClient.subscribe('/topic/active', function () {
                    updateUsers(userName);
                });

                stompClient.subscribe('/user/queue/messages', function (output) {
                    console.log("MESSAGES SUBSCRIBE");

                    showMessage(createTextNode(JSON.parse(output.body)));
                });

                sendConnection(' connected to server');
                setConnected(true);
            }, function (err) {
                alert('error' + err);
            });

        }).done(function () {
            connectionSuccessSnackbar();
        }).fail(function (jqxhr, settings, ex) {
            console.log('Connection failed, ' + ex);
            connectionWarningSnackbar();
        }
        );
}

/**
 * Disconnect websocket
 */
function disconnect() {
    if (stompClient != null) {
        $.post(chatServer + '/api/chat/user-disconnect',
            { username: userName },
            function () {
                sendConnection(' disconnected from server');

                stompClient.disconnect(function () {
                    console.log('disconnected...');
                    setConnected(false);
                });

            }).done(function () {
                this.$buefy.toast.open('Something happened')
                // alert('Request done!');
            }).fail(function (jqxhr, settings, ex) {
                console.log('failed, ' + ex);
            }
            );
    }
}

function sendConnection(message) {
    var text = userName + message;
    sendBroadcast({ 'from': 'server', 'text': text });

    // for first time or last time, list active users:
    updateUsers(userName);
}

function sendBroadcast(json) {
    stompClient.send("/app/broadcast", {}, JSON.stringify(json));
}

/**
 * Send a message
 */
function send() {
    var text = $("#message").val();
    if (selectedUser == null) {
        userSelectWarningSnackbar('Please select a user first');
        return;
    }
    stompClient.send("/ws/chat", { 'sender': userName },
        JSON.stringify({ 'from': userName, 'text': text, 'recipient': selectedUser }));
    $("#message").val("");
}

function createTextNode(messageObj) {
    var classAlert = 'alert-info';
    var fromTo = messageObj.from;
    var addTo = fromTo;

    if (userName == messageObj.from) {
        fromTo = messageObj.recipient;
        addTo = 'to: ' + fromTo;
    }

    if (userName != messageObj.from && messageObj.from != "server") {
        classAlert = "alert-warning";
    }

    if (messageObj.from != "server") {
        addTo = '<a href="javascript:void(0)" onclick="setSelectedUser(\'' + fromTo + '\')">' + addTo + '</a>'
    }

    var htmlMessage = '<div class="row alert ' + classAlert + '"><div class="">' +
      messageObj.text +
      '</div><div class=""><small>[<b>' +
      addTo +
      '</b> ' +
      messageObj.time +
      ']</small>' +
      '</div></div>';

    return htmlMessage;
}

function showMessage(message) {

    messageNotification(message);
    $("#content").html($("#content").html() + message);
    $("#clear").show();
}

function clearMessages() {
    $("#content").html("");
    $("#clear").hide();
}

function setSelectedUser(username) {
    selectedUser = username;
    $("#selectedUser").html(selectedUser);
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
    var availableUsers = $("#available-users");

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
                //availableUsers.html();
            } else {
                activeUserSpan.html('<p class="text-muted">click on user to begin chat</p>');
                //availableUsers.html('<p><i>No active users found.</i></p>');
              //availableUsers.html();

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

function createUserTab(tabLabel, content){
    return '<b-tab-item label=' + tabLabel+'>\n' + content + '</b-tab-item>';
}

function createUserTabs(tabLabels, content, userName){
    var html = "";
    console.log(tabLabels.length);
    for(let i=0; i<tabLabels.length - 1; i++){
        if (tabLabels!=userName){
            html = html + (createUserTab(tabLabels[i], content));
        }
    }
    console.log("sadfsaf"+html);

    return '<div class="column">\n' +
        '<b-tabs type="is-boxed" vertical>' +
        html +
        '</b-tabs>\n' +
        '</div>\n';
}

function createUserNode(username, index) {
    return '<li class="list-group-item">' +
        '<a class="active-user" href="javascript:void(0)" onclick="setSelectedUser(\'' + username + '\')">' + username + '</a>' +
        '</li>';
}
