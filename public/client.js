// client interface for kinect-drone

var socket, flying,
	rhand, lhand, 
	leftX, leftY, rightX, rightY,
	leftXpx, leftYpx, rightXpx, rightYpx


// data for control areas
var areas = [
	{name: "takeOff", top: 50, left: 300},
	{name: "land", top: 650, left: 300},
	{name: "up", top: 200, left: 300},
	{name: "down", top: 500, left: 300},
	{name: "left", top: 350, left:  50},
	{name: "right", top: 350, left: 550},
	{name: "clockwise", top: 500, left: 50},
	{name: "counterClockwise", top: 500, left: 550},
	{name: "backwards", top: 200, left: 50},
	{name: "forwards", top: 200, left: 550}
]


window.onload = function(){
	var ws 		= new WebSocket('ws://btncla-axdv7p.local:8080/p5websocket'),
		rhand 	= document.getElementById('right-hand'),
		lhand 	= document.getElementById('left-hand'),
		cord1 	= document.getElementById('cord1'),
		cord2 	= document.getElementById('cord2'),
		flying 	= document.getElementById('flying');

	setUpAreas(areas);
	socket = io.connect();


	ws.onpen = function(){
		console.log('websocket opened to kinect')
	}

	ws.onmessage = function(ev){
		console.log(ev.data);
		var data = JSON.parse(ev.data);

		// left hand
		leftX = Math.round(parseFloat(data[1].x)) 
		leftY = Math.round(parseFloat(data[1].y))		
		leftXpx = invert((leftX-800)/2); 
		leftYpx = invert((leftY-800)/2);
		lhand.style.top = rightYpx + 'px';
		lhand.style.left = rightXpx + 'px';

		// right hand
		rightX = Math.round(parseFloat(data[0].x)) 
		rightY = Math.round(parseFloat(data[0].y))
		rightXpx = invert((rightX-800)/2);
		rightYpx = invert((rightY-800)/2);
		rhand.style.top = leftYpx + 'px';
		rhand.style.left = leftXpx + 'px';


		cord1.innerHTML = rightY + ' : ' + leftY;
		cord2.innerHTML = rightYpx + ' : ' + leftYpx;
		isOverArea([rightYpx, rightXpx, leftYpx, leftXpx], areas);
	}
	
}


// inverts a given number
function invert(num){
	return num - (num * 2)
}


// layout the control areas
function setUpAreas(arr){
	var i = arr.length;
	while (i--) {
	    var elt = arr[i].elt = document.getElementById(arr[i].name);
	    elt.style.top = arr[i].top + 'px';
	    elt.style.left = arr[i].left + 'px';
	    elt.style.display = 'block';
	    elt.onclick = function(name){
    	   return function () {
	        	emitCommand(name);
		    };
	    }(arr[i].name)
	}
}


// test to see if either of the hand is over a control area
function isOverArea(data, arr){
	var i = arr.length;
	while (i--) {
		var name 	= arr[i].name,
			left 	= arr[i].left,
			top 	= arr[i].top,
			bottom 	= top + 100,
			right 	= left + 200;

		arr[i].elt.style['background-color'] = '#eee';

		// right within height and width
		if(data[0] > top &&  data[0] < bottom && data[1] > left &&  data[1] < right){
			arr[i].elt.style['background-color'] = '#f00';
			console.log('right hand over: ' + name);
			emitCommand(name);
		}

		// left within height and width
		if(data[2] > top &&  data[2] < bottom && data[3] > left &&  data[3] < right){
			arr[i].elt.style['background-color'] = '#f00';
			console.log('left hand over: ' + name)
			emitCommand(name);
		}	
	}
}


// send command via websockets to node.js server
function emitCommand(cmd){
	socket.emit('move', cmd);

	// if takeoff - after 2 secs display other controls
	if(cmd === 'takeOff'){
		setTimeout(function(){
			flying.style.display = 'block';
			takeOff.style.display = 'none';
		}, 2000)
	}

	// if land - after 2 secs hide other controls
	if(cmd === 'land'){
		setTimeout(function(){
			flying.style.display = 'none';
			takeOff.style.display = 'block';
		}, 2000)
	}
}

