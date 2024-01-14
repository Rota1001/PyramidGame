reftop = window.screen.height / 2 + 100;
refleft = window.screen.width / 2 - 120 * 2.5;
function btn(id, left, top){
    return "<div id=\""+id+"\"style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"triBtn\" href=\"javascript:f();\"></a>\
            </div> "
}

function arcbtn(id, left, top){
    return "<div id=\""+id+"\"style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"triBtnFliped\" href=\"javascript:f();\"></a>\
            </div> "
}

function init(){
    for(i = 0; i < 5; i++){
        for(j = 0; i + j < 5; j++){
           document.body.innerHTML += btn((i * 5 + j) * 2, refleft + (i + j / 2) * 120, reftop - (j) * 100);
        }
    }
    for(i = 0; i < 5; i++){
        for(j = 0; i + j < 4; j++){
           document.body.innerHTML += arcbtn((i * 5 + j) * 2 + 1, refleft + (i + j / 2 + 1 / 2) * 120, reftop - (j) * 100);
        }
    }
}
function printMousePos(event) {
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
    alert(`x:${floorx} y:${floory} z:${z}`);
}
document.addEventListener("click", printMousePos);
