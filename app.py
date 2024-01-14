from flask import *
from flask_login import *

app = Flask(__name__)
app.secret_key = app.config.get('flask', '2b637a3da3bc2c75c90115b79c67349c')
loginManager = LoginManager()
loginManager.init_app(app)
loginManager.session_protection = "strong"
loginManager.login_view = 'login'
loginManager.login_message = 'Please Login First' 
playerList = []
playingList = {}
board = {}
n = 0
staticPath = "./static"

with open(staticPath + "/data/password.json", "r") as fp:
    users = json.load(fp)

class User(UserMixin):
    pass

@loginManager.user_loader
def user_loader(username):
    if username not in users:
       return
    user = User()
    user.id = username
    return user

@loginManager.request_loader
def request_loader(request):
    username = request.form.get('user_id')
    if username not in users:
        return
    user = User()
    user.id = username
    user.is_authenticated = request.form['password'] == users[username]['password']
    return user

def createBoard():
    return [[[0 for i in range(2)] for j in range(5)] for k in range(5)]

@app.route("/")
def root():
    return redirect("/index")

@app.route("/index")
def Index():
    flash("Hello")
    return render_template("index.html")

@app.route("/login", methods = ["GET", "POST"])
def login():
    if request.method == 'GET':
        return render_template("login.html")
    username = request.form['username']
    if (username in users) and (request.form['password'] == users[username]['password']):
        user = User()
        user.id = username
        login_user(user)
        return redirect('/waitingRoom')
    return render_template('login.html')

@app.route("/signUp", methods = ["GET", "POST"])
def signUp():
    if request.method == 'GET':
        return render_template("signUp.html")
    username = request.form['username']
    if (username not in users) and (request.form['password'] == request.form['passwordAgain']):
        user = User()
        user.id = username
        users.update({username : {"password" : request.form['password']}})
        login_user(user)
        with open(staticPath + '/data/password.json', 'w') as fp:
            fp.write(json.dumps(users))
        return redirect('/login')
    return render_template("signUp.html")

@app.route("/close", methods = ["GET"])
def close():
    if request.args.get("id"):
        global playerList
        try:
            playerList.remove(request.args.get("id"))
        except:
            pass
        return jsonify({})

@app.route("/waitingRoom", methods = ["GET"])
@login_required
def waiting():
    if request.args.get("id"):
        if request.args.get("id") == "-1":
            global n
            info = {"id" : n}
            n = n + 1
            return jsonify(info)
        else:
            id = request.args.get("id")
            global playerList
            global playingList
            if id in playingList:
                return jsonify({"opponent" : playingList[id]})
            if id not in playerList:
                playerList.append(id)
            if len(playerList) >= 2:
                playerList.remove(id)
                oppo = playerList.pop()
                playingList.update({id : oppo})
                playingList.update({oppo : id})
                board.update({id : createBoard()})
                board.update({oppo : board[id]})
                return jsonify({"opponent" : oppo})
        return jsonify({"opponent" : "-1"})
    return render_template("waitingRoom.html")

@app.route("/gameRoom/<id>", methods = ["GET"])
@login_required
def gameRoom(id):
    return render_template("gameRoom.html")

if(__name__ == "__main__"):
    app.run(debug=True)