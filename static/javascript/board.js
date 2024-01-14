let reftop = 500
let refleft = 100
let nowNum;
let board;
let vis;
let sum;
let meet;
let dir = [[1, 0, 0],[0, 1, 0],[-1, 0, 0],[0, -1, 0],[1, -1, 0], [-1, 1, 0], [1, -1, 1], [-1, 1, 1]];
let turn;
let myId;
let oppoId;


function btn(i, j){
    let left = refleft + (i + j / 2) * 120;
    let top = reftop - j * 100;
    return "<div style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"triBtn\"></a>\
            </div> "
}

function arcbtn(i, j){
    let left = refleft + (i + j / 2 + 1 / 2) * 120;
    let top = reftop - (j) * 100;
    return "<div style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"triBtnFliped\"></a>\
            </div> "
}

function invbtn(i, j){
    let left = refleft + (i + j / 2) * 120;
    let top = reftop - j * 100;
    return "<div style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"invtriBtn\"></a>\
            </div> "
}

function invarcbtn(i, j){
    let left = refleft + (i + j / 2 + 1 / 2) * 120;
    let top = reftop - (j) * 100;
    return "<div style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"invtriBtnFliped\"></a>\
            </div> "
}

function text(id, num, i, j){
    let left = refleft + (i + j / 2) * 120;
    let top = reftop - (j) * 100 + 5;
    return "<div id=\""+id+"\"style=\"position:absolute;top:"+top+"px;left:"+left+"px;color:#fff;transform: translate(-50%, -25%);font-size:1.5rem;font-family:sans-serif;font-weight:bold;\">"+num+"</div>"
}

function arctext(id, num, i, j){
    let left = refleft + (i + j / 2 + 1 / 2) * 120;
    let top = reftop - (j) * 100 - 20;
    return "<div id=\""+id+"\"style=\"position:absolute;top:"+top+"px;left:"+left+"px;color:black;transform: translate(-50%, -25%);font-size:1.5rem;font-family:sans-serif;font-weight:bold;\">"+num+"</div>"
}

function init(){
    nowNum = 1;
    board = new Array(5);
    for(var i = 0; i < 5; i++){
        board[i] = new Array(5);
        for(var j = 0; j < 5; j++){
            board[i][j] = new Array(2);
            for(var k = 0; k < 2; k++){
                board[i][j][k] = 0;
            }
        }
    }
    for(i = 0; i < 5; i++){
        for(j = 0; i + j < 5; j++){
           document.body.innerHTML += btn(i, j);
           document.body.innerHTML += text((i * 5 + j) * 2, "", i, j);
        }
    }
    for(i = 0; i < 5; i++){
        for(j = 0; i + j < 4; j++){
           document.body.innerHTML += arcbtn(i, j);
           document.body.innerHTML += arctext((i * 5 + j) * 2 + 1, "", i, j);
        }
    }
    document.body.innerHTML += invbtn(4, 4);
    document.body.innerHTML += invarcbtn(4, 4);
    document.body.innerHTML += invarcbtn(3, 4);
}

function turnText(text){
    if(document.getElementById("showTurn"))
        document.getElementById("showTurn").remove();
    document.body.innerHTML += "<div id= \"showTurn\" style=\"position:absolute;top:500px;left:850px;color:black;transform: translate(-50%, -25%);font-size:1.5rem;font-family:sans-serif;font-weight:bold;\">"+text+"</div>"
    
}

function checkTurn(){
    setInterval(
        '$.ajax({\
            url : ("/turn?stat=quest&id=" + Math.min(parseInt(myId), parseInt(oppoId))),\
            method : "GET",\
            dataType : "json",\
            success : function(response){\
                if(response.turn == "0"){\
                    if(myId < oppoId){\
                        turn = 1;\
                    }else{\
                        turn = 0;\
                    }\
                }else if(myId < oppoId){\
                    turn = 0;\
                }else{\
                    turn = 1;\
                }\
                if(turn){\
                    turnText("Your Turn");\
                }else{\
                    turnText("Your Opponent\'s Turn");\
                }\
                nowNum = parseInt(response.num);\
                if(response.chg != "-1"){\
                    let x = parseInt(response.x);\
                    let y = parseInt(response.y);\
                    let z = parseInt(response.z);\
                    let n = parseInt(response.n);\
                    if(board[x][y][z] == 0){\
                        changeText(x, y, z, n);\
                        board[x][y][z] = parseInt(n);\
                    }\
                }\
                if(done()){\
                    if(turn){\
                        alert("You Loss");\
                    }else{\
                        alert("You Win");\
                    }\
                    location.href = "/waitingRoom";\
                }\
            },\
            error : function(error){\
                console.log(error);\
            }\
        })', 2500)
}

function changeTurn(x, y, z, n){
        $.ajax({
            url : ("/turn?stat=change&id="+Math.min(parseInt(myId), parseInt(oppoId))+`&x=${x}&y=${y}&z=${z}&n=${n}`),
            method : "GET",
            dataType : "json",
            success : function(response){
                turn ^= 1;
                nowNum = parseInt(response.num);
            },
            error : function(error){
                console.log(error);
            }
        })
}

function changeText(x, y, z, num){
    document.getElementById((x * 5 + y) * 2 + z).remove();
    if(!z){
        document.body.innerHTML += text((x * 5 + y) * 2 + z, num, x, y);
    }else{
        document.body.innerHTML += arctext((x * 5 + y) * 2 + z, num, x, y);
    }

}

function dfs(x, y, z){
    sum += board[x][y][z];
    if(z == 0){
        if(x + y + 1 < 5 && board[x][y][1] && !vis[x][y][1]){
            vis[x][y][1] = 1;
            meet = 1;
            dfs(x, y, 1);
        }
        if(y - 1 >= 0 && board[x][y - 1][1] && !vis[x][y - 1][1]){
            vis[x][y - 1][1] = 1;
            meet = 1;
            dfs(x, y - 1, 1);
        }
        if(x - 1 >= 0 && board[x - 1][y][1] && !vis[x - 1][y][1]){
            vis[x - 1][y][1] = 1;
            meet = 1;
            dfs(x - 1, y, 1);
        }
    }else{
        if(board[x][y][0] && !vis[x][y][0]){
            vis[x][y][0] = 1;
            meet = 1;
            dfs(x, y, 0);
        }
        if(board[x + 1][y][0] && !vis[x + 1][y][0]){
            vis[x + 1][y][0] = 1;
            meet = 1;
            dfs(x + 1, y, 0);
        }
        if(board[x][y + 1][0] && !vis[x][y + 1][0]){
            vis[x][y + 1][0] = 1;
            meet = 1;
            dfs(x, y + 1, 0);
        }
    }
}

function check(x, y, z, num){
    sum = 0;
    meet = 0;
    vis = new Array(5);
    for(var i = 0; i < 5; i++){
        vis[i] = new Array(5);
        for(var j = 0; j < 5; j++){
            vis[i][j] = new Array(2);
            for(var k = 0; k < 2; k++){
                vis[i][j][k] = 0;
            }
        }
    }
    vis[x][y][z] = 1;
    sum += num;
    dfs(x, y, z);
    for(var t = 0; t < 6; t++){
        sum = -sum;
        let tmp = new Array(5);
        for(var i = 0; i < 5; i++){
            tmp[i] = new Array(5);
            for(var j = 0; j < 5; j++){
                tmp[i][j] = new Array(2);
                for(var k = 0; k < 2; k++){
                    tmp[i][j][k] = vis[i][j][k];
                }
            }
        }
        for(var i = 0; i < 5; i++){
            for(var j = 0; j < 5; j++){
                for(var k = 0; k < 2; k++){
                    if(!tmp[i][j][k] || i + j + k >= 5)continue;
                    for(var d = 0; d < 8; d++){
                        let newx = i + dir[d][0];
                        let newy = j + dir[d][1];
                        let newz = k ^ dir[d][2];
                        if(newx < 0 || newy < 0 || newx + newy + newz >= 5 || !board[newx][newy][newz] || vis[newx][newy][newz])continue;
                        meet = 1;
                        vis[newx][newy][newz] = 1;
                        dfs(newx, newy, newz);
                    }
                    if(k == 0){
                        if(i - 1 >= 0 && j - 1 >= 0 && board[i - 1][j - 1][1] && !vis[i - 1][j - 1][1]){
                            meet = 1;
                            vis[i - 1][j - 1][1] = 1;
                            dfs(i - 1, j - 1, 1);
                        }
                    }else if(i + 1 + j + 1 < 5 && board[i + 1][j + 1][0] && !vis[i + 1][j + 1][0]){
                        meet = 1;
                        vis[i + 1][j + 1][0] = 1;
                        dfs(i + 1, j + 1, 0);
                    }
                }
            }
        }
    }
    if(sum % 3 == 0 || !meet)return true;
    return false;
}

function printMousePos(event) {
    if(!turn)return;
    x = event.clientX;
    y = event.clientY;
    x -= refleft - 60;
    y -= reftop + 50;
    tmpx = (100 * x + 60 * y) / 12000;
    tmpy = (120 * y) / (-12000);
    x = tmpx;
    y = tmpy;
    floorx = Math.floor(x)
    floory = Math.floor(y)
    z = 0
    if(x - floorx + y - floory > 1){
        z = 1
    }
    if(floorx + floory + z >= 5)return;
    if(board[floorx][floory][z] == 0 && check(floorx, floory, z, nowNum)){
        changeText(floorx, floory, z, nowNum);
        board[floorx][floory][z] = nowNum;
        changeTurn(floorx, floory, z, nowNum++);
    }
}

function done(){
    for(var i = 0; i < 5; i++){
        for(var j = 0; j < 5; j++){
            for(var k = 0; k < 2; k++){
                if(i + j + k >= 5)continue;
                if(board[i][j][k] == 0 && check(i, j, k, nowNum)){
                    return false;
                }
            }
        }
    }
    return true;
}
document.addEventListener("click", printMousePos);
