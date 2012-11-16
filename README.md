# kinect-drone

My hack project from [nodecopter brighton](http://nodecopter.com/2012/brighton/nov-10) Nov 2012


This project allows you to control an AR-Drone 2.0 using a Kinect. It uses a couple of pieces of middleware, and node.js. You need to install the following software:

* [SimpleOpenNI](http://code.google.com/p/simple-openni/)
* [Processing](http://processing.org/)
* [Node.js](http://nodejs.org/)

SimpleOpenNI is a great project that wraps OpenNI and NITE for processing. Using the SimpleOpenNI install package is considerably easier than trying to install the components individually and it also makes sure you have the right USB driver for Kinect installed. 

Processing is used to visualise the Kinect output and passes hand movement data via websockets to the browser. The browser then sends commands to the server using another websockets connection. Then finally the node.js server uses Felix Geisendörfer node-ar-drone module to control the drone. 

This should work with either the standard Xbox360 Kinect or the Kinect for Windows version

Install this project

    $ npm install https://github.com/glennjones/kinect-drone.git

1. Open the file kinect-websockets.pde with processing application.

2. Start the node.js server

    $ node app.js

3. Once processing is displaying the video stream from Kinect and the node server is up and running, open the web client

    http://localhost:3001/index.html

Have fun