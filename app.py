from flask import *
app = Flask(__name__)

@app.route("/")
def root():
    return redirect("/index")

@app.route("/index")
def Index():
    return render_template("Index.html")

@app.route("/login")
def Login():
    return render_template("Login.html")

if(__name__ == "__main__"):
    app.run()