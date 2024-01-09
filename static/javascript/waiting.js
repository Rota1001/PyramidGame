var id = -1;
$.ajax({
    url : ("/waitingRoom?id=" + id),
    method : "GET",
    dataType : "json",
    success : function(response){
        id = response.id;
        alert(id);
    },
    error : function(error){
        console.log(error);
    }
}).then(
    function(){
        setInterval(
        '$.ajax({\
            url : ("/waitingRoom?id=" + id),\
            method : "GET",\
            dataType : "json",\
            success : function(response){\
                if(response.opponent != "-1"){\
                    location.href = "/gameRoom/id=" + id;\
                }\
            },\
            error : function(error){\
                console.log(error);\
            }\
        })', 2500)
    }
)


