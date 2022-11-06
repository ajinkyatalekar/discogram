import bottle
import json
import time
import threading

@bottle.route("/")
def serve_html():
    return bottle.static_file("index.html", root=".")
    
@bottle.route("/profile")
def retProf():
    return bottle.static_file("profile.jpeg", root=".")
    
@bottle.route("/logo")
def serve_logo():
    return bottle.static_file("logo.png", root=".")
    
@bottle.route("/bg1")
def serve_bgImage():
    return bottle.static_file("bg1.png", root=".")

@bottle.route("/bg2")
def serve_bgImage2():
    return bottle.static_file("bg3.png", root=".")

@bottle.route("/script")
def serve_js():
    return bottle.static_file("script.js", root=".")


@bottle.route("/ajax")
def serve_ajax():
    return bottle.static_file("ajax.js", root=".")


@bottle.route("/stylesheet")
def serve_css():
    return bottle.static_file("stylesheet.css", root=".")


@bottle.route("/getActiveUsers")
def serve_active_users():
    with open("activeUsers.txt", "r") as f:
        ls = []
        for line in f:
            ls.append(line)
        return json.dumps(ls)

@bottle.route("/getActiveGroups")
def serve_active_groups():
    with open("activeGroups.txt", "r") as f:
        ls = []
        for line in f:
            ls.append(line)
        return json.dumps(ls)

@bottle.route("/setActive")
def serve_activity():
    with open("activeUsers.txt", "a") as f:
        f.write()

@bottle.post("/sendUsername")
def serve_username_post():
    jsonContent = bottle.request.body.read().decode()
    content = json.loads(jsonContent)
    inList = False
    with open("activeUsers.txt", "r") as f:
        for line in f:
            if (line == content["username"] + "\n"):
                inList = True
    if not inList:
        with open("activeUsers.txt", "a") as f:
            f.write(content["username"] + "\n")
    return json.dumps("Complete")

@bottle.post("/getGroup")
def serve_group():
    jsonContent = bottle.request.body.read().decode()
    content = json.loads(jsonContent)
    fileLink = "chats/" + content["group"] + ".txt"

    ls = []
    with open(fileLink, "a") as f:
        print("f")
    with open(fileLink) as f:
        for line in f:
            ls.append(json.dumps(line))

    return json.dumps(ls)


@bottle.post("/getChat")
def serve_chat():
    jsonContent = bottle.request.body.read().decode()
    content = json.loads(jsonContent)
    fileLink = "chats/"
    if (content["userCurr"] > content["userAway"]):
        fileLink += content["userCurr"] + "&&" + content["userAway"] + ".txt"
    else:
        fileLink += content["userAway"] + "&&" + content["userCurr"] + ".txt"

    ls = []
    with open(fileLink, "a") as f:
        print("f")
    with open(fileLink) as f:
        for line in f:
            ls.append(json.dumps(line))

    return json.dumps(ls)


@bottle.post("/sendMessage")
def serve_send_message():
    t = time.localtime()
    current_time = time.strftime("%H:%M", t)

    jsonContent = bottle.request.body.read().decode()
    content = json.loads(jsonContent)
    dict = {
        "message": content["message"],
        "time": current_time,
        "user": content["username"]
    }
    if (content["group"] == "false"):
        fileLink = "chats/"
        if (content["username"] > content["userAway"]):
            fileLink += content["username"] + "&&" + content["userAway"] + ".txt"
        else:
            fileLink += content["userAway"] + "&&" + content["username"] + ".txt"
    
        with open(fileLink, "a") as f:
            f.write(json.dumps(dict) + "\n")
    else:
        fileLink = "chats/" + content["userAway"] + ".txt"
        
        with open(fileLink, "a") as f:
            f.write(json.dumps(dict) + "\n")
        
    return json.dumps(dict)

def clearChat():
   threading.Timer(8.0, clearChat).start()
   with open("activeUsers.txt", "w") as f:
       print("clearing users")

clearChat()

bottle.run(host="0.0.0.0", port=8080)

