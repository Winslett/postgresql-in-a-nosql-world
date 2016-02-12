var pg = require ('pg');

var pgConString = "postgres://localhost/nosql_test"

pg.connect(pgConString, function(err, client) {
  if(err) {
    console.log(err);
  }
  client.on('notification', function(msg) {
    console.log(msg);
  });
  var query = client.query("LISTEN hammertime");
});
