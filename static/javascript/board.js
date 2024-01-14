function btn(id, left, top){
    return "<div id="+id+"style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"triBtn\" href=\"javascript:f();\"></a>\
            </div> "
}

function arcbtn(id, left, top){
    return "<div id="+id+"style=\"position:absolute;top:"+top+"px;left:"+left+"px;\">\
                <a class=\"triBtnFliped\" href=\"javascript:f();\"></a>\
            </div> "
}