username = ""
useraway = ""
prev = ""
group = ""

function setSizes() {
    document.getElementById("screen").style.height = window.innerHeight*0.9 + "px";
    document.getElementById("screen").style.width= window.innerHeight*0.85*9/16 + "px";
    document.getElementById("activeUsers").style.maxHeight= window.innerHeight*0.9*0.85*0.5 + "px";
    document.getElementById("groupChats").style.maxHeight= window.innerHeight*0.9*0.85*0.5 + "px";
    document.getElementById("chat").style.height= window.innerHeight*0.9*0.79 + "px";
}

// Getting the username
function confirmUsername() {
    // Server communication
    console.log("Sending Username...");
    if (username == "") {
        username = document.getElementById("usernameInput").value;
        if (username != "") {
            updateActiveUsers();
            jsonDict = {"username": username};
            ajaxPostRequest("/sendUsername", JSON.stringify(jsonDict), response);
            console.log("Sent Username!")
    
            // Local changes
            document.getElementById("userInputScreen").style.display = "none";
            document.getElementById("chatScreen").style.display = "none";
            document.getElementById("chatSelectScreen").style.display = "block";
            
            els = document.getElementsByClassName("usernameHeader");
            for (let el of els) {
                el.innerHTML = username;
            }
        }
    } else {
            updateActiveUsers();
            jsonDict = {"username": username};
    
            // Local changes
            document.getElementById("userInputScreen").style.display = "none";
            document.getElementById("chatScreen").style.display = "none";
            document.getElementById("chatSelectScreen").style.display = "block";
            
            els = document.getElementsByClassName("usernameHeader");
            for (let el of els) {
                el.innerHTML = username;
            }
        
    }
}

function response(resp) {
    let username = document.getElementById("usernameInput");
    username.value = JSON.parse(resp);
}

function updateActiveUsers() {
    ajaxGetRequest("/getActiveUsers", updateSelectScreen);
    ajaxGetRequest("/getActiveGroups", updateGroups);
    jsonDict = {"username": username};
    ajaxPostRequest("/sendUsername", JSON.stringify(jsonDict), update)
    const interval = setInterval(function() {
        ajaxGetRequest("/getActiveUsers", updateSelectScreen);
        ajaxGetRequest("/getActiveGroups", updateGroups);
        jsonDict = {"username": username};
        ajaxPostRequest("/sendUsername", JSON.stringify(jsonDict), update)
    }, 3000);
}

function update() {
    
}

function updateGroups(resp) {
    users = JSON.parse(resp);
        document.getElementById("groupChats").innerHTML = ""
    for (user of users) {
        user = user.replace(/\n/g, "")
        document.getElementById("groupChats").innerHTML += "<a onclick='initGroup(\"" + user + "\")'><p id='chatEl'>" + user + "</p></a>";
    }
}

function updateSelectScreen(resp) {
    users = JSON.parse(resp);
        document.getElementById("activeUsers").innerHTML = ""
    for (user of users) {
        user = user.replace(/\n/g, "")
        if (user != username) {
            document.getElementById("activeUsers").innerHTML += "<a onclick='initChat(\"" + user + "\")'><p id='chatEl'>" + user + "</p></a>";
        }
    }
}

function initChat(userAway) {
    console.log("Init chat w " + username + " and " + userAway);
    useraway = userAway;
    group = "false"
    // Local changes
    document.getElementById("userInputScreen").style.display = "none";
    document.getElementById("chatSelectScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "block";
    
    els = document.getElementsByClassName("usernameHeader");
    for (let el of els) {
        el.innerHTML = userAway;
    }

    usernames = {"userCurr": username, "userAway": userAway};
    
    ajaxPostRequest("/getChat", JSON.stringify(usernames), displayChat);
    const interval = setInterval(function() {
        ajaxPostRequest("/getChat", JSON.stringify(usernames), displayChat);
    }, 3000);
}

function initGroup(groupName) {
    // Local changes
    useraway = groupName;
    group = "true"
    document.getElementById("userInputScreen").style.display = "none";
    document.getElementById("chatSelectScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "block";
    
    els = document.getElementsByClassName("usernameHeader");
    for (let el of els) {
        el.innerHTML = useraway;
    }

    usernames = {"userCurr": username, "group": groupName};
    
    ajaxPostRequest("/getGroup", JSON.stringify(usernames), displayChat);
    const interval = setInterval(function() {
        ajaxPostRequest("/getGroup", JSON.stringify(usernames), displayChat);
    }, 3000);
}

function displayChat(resp) {
    chat = JSON.parse(resp);
    if (prev != chat) {
        document.getElementById("chat").innerHTML = ""
        for (let message of chat) {
            displayMessage(JSON.parse(message));
        }
        prev = chat;
    }
}

function sendText() {
    message = document.getElementById("messageInput").value;
    if (message != "") {
        document.getElementById("messageInput").value = "";
        package = {"message": message, "username": username, "userAway": useraway, "group": group}
        ajaxPostRequest("/sendMessage", JSON.stringify(package), displayMessage);
    }
}

function displayMessage(resp) {
    out = JSON.parse(resp);
    messageBox = document.getElementById("chat");
    if (out["user"] == username) {
        msg = "<div class='messageInst message_user'>" + out["message"] + "<br><element>" + out["user"] + ", " + out["time"] + "</element></div><br>";
    } else {
        msg = "<div class='messageInst message_away'>" + out["message"] + "<br><element>" + out["user"] + ", " + out["time"] + "</element></div><br>";
    }
    messageBox.innerHTML = messageBox.innerHTML + msg;
}
