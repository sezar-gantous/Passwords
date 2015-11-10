/*
*This file is all about firebase
*
*Nov 20 2015
*/

var db = new Firebase("https://whatsmypassword.firebaseio.com/services");
var service;

// Attach an asynchronous callback to read data
db.on("value", function(snapshot) {
  service = snapshot.val(); 
  console.log(service);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//console.log(db.child('service').child);