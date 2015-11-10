var empty = '<li class="list-group-item" id="empty">No Services to show... Add a service NOW!</li>';


    $(document).ready(function() {
      loadFromJson();
    });




/*when user firt adds a Service*/
    function addService() {
       $("#info").show();

        var userName = $("#userName").val();
        var service = $("#service").val();
        var password = $("#password").val();
       

       db.child(service).set({
        service: service,
        userName: userName,
        password: password
       });


      $("#info").hide();

    }




    function removeService (service) {

       // console.log("removing");
       //remove from firebase
      db.child(service).remove();

    }

    function editing (serviceName,password,userName) {
      //preparing modal
      $("#modalLabel").html('Edite'+serviceName);
      $("#editUserName").val(userName);
      $("#editService").val(serviceName);
      $("#editPassword").val(password);

      //add click event for save button
      $("#editSave").click(function(){
        
        //remove current 
           db.child(serviceName).remove();
        //creat a new one....
        db.child($("#editService").val()).set({
          service: $("#editService").val()+'',
          username: $("#editUserName").val()+'',
          passweord: $("#editPassword").val()+''
        });

        $('#editModal').modal('hide');

      });

      $('#editModal').modal('show')
    }



/*make a fake ajax call to the url; which will wake up the dyno */
    // function wakeUp (url,name) {
    //  console.log(url);
    //   // an indecations to the use the server is still waking up
    //     $("#li-"+name).css({"z-index":"-1"}).addClass("disabled");
    //   $.ajax(url+'')
    //   .fail(function( jqXHR, textStatus){
    //    /* It's not really working...???*/
    //      console.dir("faild: "+jqXHR.status + "  "+ textStatus);
    //     if(jqXHR.status === 200)
    //     {
    //       console.log("status:200");
    //     }
    //     // an indecations to the use the server is done waking up
    //     $("#li-"+name).css({"z-index":"1"}).removeClass("disabled");
    //   })
    //   .done(function(){
    //     // an indecations to the use the server is done waking up
    //     $("#li-"+name).css({"z-index":"1"}).removeClass("disabled");
    //   })
    //   .always(function(){
       
    //   });
    // }


    function print (service) {
     var str = '';
     var serviceName = service.service;
     var userName = service.userName;
     var password = service.password;


     str+= '<li id="li-'+ serviceName +'" class="list-group-item">';
     str+= '<a href="'+serviceName+'" target="_blank" title="'+serviceName+'">';
     str+= serviceName;
     str+= '</a>'
          
     str+= '<button id="remove-'+ serviceName +'" class="alert alert-danger remove" onClick="removeService('+"'"+serviceName+"'"+');" title="delete Service">'+
               '<span id="spanRemove-'+ serviceName +'" class="glyphicon glyphicon-remove"></span> </button>';
     str+= '<button id="edit-'+ serviceName +'" class="alert alert-info edit" onClick="editing('+"'"+serviceName+"'"+','+"'"+password+"'"+','+"'"+userName+"'"+');" title="edit Service">'+
               '<span id="spanEdit-'+ serviceName +'" class="glyphicon glyphicon-pencil"></span> </button>';
     
     str += '</li>';
      $("#services").append(str);


    }


/*load all data from firebase*/
function loadFromJson () {
  

  // Attach an asynchronous callback to read data
  db.on("value", function(snapshot) {
   
     if(snapshot.val() !== null){
            // iterate through data
        //clear the list first
          $("#services").empty();
        snapshot.forEach(function(s) {
          //console.log(s.val().stat);
            var service = s.val();
          
           //print out html with data
           print(service);
        });
    }
    else{
         //empty is defined top of the file
       $("#services").html(empty);
    } 
      console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    
    $("#theError").html(errorObject.code);
    $("#err").show();

  });

   

}

//everytime a service is deleted this will be called
db.on("child_removed", function(snapshot) {
  var deletedPost = snapshot.val();
  console.log("removed");
});

//everytime a service is deleted this will be called
db.on("child_changed", function(snapshot) {
  var changedPost = snapshot.val();
  console.log("updated");
});