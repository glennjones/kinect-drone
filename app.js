  // kinect-drone server

  var http      = require('http')
      express   = require("express"),
      sio       = require("socket.io"),
      ardrone   = require("ar-drone"),
      app       = express(),
      drone     = ardrone.createClient();

  drone.config('general:navdata_demo', 'TRUE');


  app.configure(function() {
    app.set('port', process.env.PORT || 3001);
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  });


  // start web server
  var server = http.createServer(app);
  server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });


  // start socket server
  var io = sio.listen(server);
  io.sockets.on('connection', function(socket) {
    console.log('socket client connected');
    socket.on('move', function(cmd) {
      move(cmd)
    })

  })


  // execute drone command
  function move(cmd){
    drone.[cmd]
    console.log(cmd)
  }