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
n = 0

with open("./static/data/password.json", "r") as fp:
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
        with open('./static/data/password.json', 'w') as fp:
            fp.write(json.dumps(users))
        return redirect('/login')
    return render_template("signUp.html")

@app.route("/waitingRoom", methods = ["GET"])
@login_required
def waiting():
    if request.args.get("id"):
        if request.args.get("id") == "-1":
            global n
            info = {"id": n}
            n = n + 1
            return jsonify(info)
    return render_template("waitingRoom.html")

if(__name__ == "__main__"):
    app.run(debug=True)