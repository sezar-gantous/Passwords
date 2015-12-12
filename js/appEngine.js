var db = new Firebase("https://whats-next.firebaseio.com/services");
var service;


var empty = '<li class="list-group-item" id="empty">No Services to show... Add a service NOW!</li>';
var passwordArray = [];

    $(document).ready(function() {
      loadFromJson();
    });




/*when user firt adds a Service*/
    function addService() {
       $("#info").show();

        var userName = $("#userName").val();
        var service = $("#service").val();
        var password = $("#password").val();
       

var totalPasswords = (passwordArray === null)? 0: passwordArray.length;

       db.child(totalPasswords).set({
        service: service,
        userName: userName,
        password: password
       });


      $("#info").hide();
      
      $("#userName,#service,#password").val('');
    }




    function removeService (id) {

         // console.log("removing");
         passwordArray.splice(id, 1);
       //remove from firebase
      db.set(passwordArray);

    }

    function editing (id,serviceName,password,userName) {
      //preparing modal
      $("#modalLabel").html('Edite '+serviceName);
      $("#editUserName").val(userName);
      $("#editService").val(serviceName);
      $("#editPassword").val(password);

      $("#editSave").off();
      //add click event for save button
      $("#editSave").click(function(){
        

        //creat a new one....
        db.child(id).update({
          service: $("#editService").val(),
          userName: $("#editUserName").val(),
          password: $("#editPassword").val()
        });
  
              //console.log(serviceName);
        $('#editModal').modal('hide');

      });

      $('#editModal').modal('show')
    }




    function print (service,id) {
     var str = '';
     var serviceName = service.service;
     var userName = service.userName;
     var password = service.password;


     str+= '<li id="li-'+ id +'" class="list-group-item">';
     str+= '<a id="info-'+id +'" href="#'+id+'" title="'+serviceName+'">';
     str+= serviceName;
     str+= '</a>'
          
     str+= '<button id="remove-'+ id +'" class="alert alert-danger remove" onClick="removeService('+id+');" title="delete Service">'+
               '<span id="spanRemove-'+ id +'" class="glyphicon glyphicon-remove"></span> </button>';
     str+= '<button id="edit-'+ id +'" class="alert alert-info edit" onClick="editing('+id+",'"+serviceName+"'"+','+"'"+password+"'"+','+"'"+userName+"'"+');" title="edit Service">'+
               '<span id="spanEdit-'+ id +'" class="glyphicon glyphicon-pencil"></span> </button>';
     
     str += '</li>';
     str += '<div class="extraInfo alert alert-info" role="alert" id="show-'+id+'">';
     str += '<p><b>User Name: </b>' +userName+'</p>';
     str += '<p><b>Password: </b>' +password+'</p>';
     str += '</div>';
      $("#services").append(str);

    $('#info-'+id).on('click',function (){
      $('#show-'+id +".extraInfo").toggle();
    });

    }


/*load all data from firebase*/
function loadFromJson () {
    var index;

  // Attach an asynchronous callback to read data
  db.on("value", function(snapshot) {
   
     if(snapshot.val() !== null){
            // iterate through data
        //clear the list first
          $("#services").empty();

          index=0;   
          //empty array first
          passwordArray = [];

        snapshot.forEach(function(s) {
          //console.log(s.val().stat);
            var service = s.val();
             passwordArray.push(service); 
           //print out html with data
           print(service,index);
           index++;
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
