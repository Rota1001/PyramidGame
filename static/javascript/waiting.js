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
})