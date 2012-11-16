  // kinect-drone server

  var http      = require('http'),
      path      = require('path')
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

    if(cmd === 'stop')
      drone.stop()

    if(cmd === 'takeoff'){
      drone.disableEmergency();
      drone.takeoff()
    }

    if(cmd === 'land'){
      // use stop to make it hover then land
      drone.stop();
      drone.land();
    }
      
    if(cmd === 'left')
      drone.left(0.2)

    if(cmd === 'right')
      drone.right(0.2)

    if(cmd === 'backwards')
      drone.back(0.2)

    if(cmd === 'forwards')
      drone.front(0.2)

    console.log(cmd)
  }