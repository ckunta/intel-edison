

//var ipAddress = '192.168.2.15'; 

var ipAddress = '192.168.1.34';
//var ipAddress = '10.5.12.19';
//var ipAddress = '192.168.0.53';


// Start by loading in some data
var fs = require('fs');

//var lightSensorPage = fs.readFileSync('./erosionlogic.html');
var lightSensorPage = fs.readFileSync('/node_app_slot/lightsensor.html');

// Insert the ip address in the code in the page

lightSensorPage = String(lightSensorPage).replace(/<<ipAddress>>/, ipAddress);


/**
 * Accelerometer code starts here
 */
var digitalAccelerometer = require('jsupm_mma7660');
// Instantiate an MMA7660 on I2C bus 0
var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(
					digitalAccelerometer.MMA7660_I2C_BUS, 
					digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);

// place device in standby mode so we can write registers
myDigitalAccelerometer.setModeStandby();

// enable 64 samples per second
myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);

// place device into active mode
myDigitalAccelerometer.setModeActive();

var x, y, z;
x = digitalAccelerometer.new_intp();
y = digitalAccelerometer.new_intp();
z = digitalAccelerometer.new_intp();


function getInclination() {
        var tilt;
	myDigitalAccelerometer.getRawValues(x, y, z);
        
        tilt = digitalAccelerometer.intp_value(x);
        console.log("Value of tilt is " + tilt);
        return tilt;
}

// end of accelerometer */

// start of touch sensor

// Load TTP223 touch sensor module
var sensorModule = require('jsupm_ttp223');

// Create the TTP223 touch sensor object using GPIO pin 4
var touch = new sensorModule.TTP223(4);

// Check whether or not a finger is near the touch sensor and
// print accordingly, waiting one second between readings
function readTouchSensorValue() {
    if ( touch.isPressed() ) {
        console.log(touch.name() + " is pressed");
        return 1;
    } else {
        console.log(touch.name() + " is not pressed");
        return 0;
    }
    
}
//setInterval(readSensorValue, 1000);


// end of touch sensor

// start of pot

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var analogPin0 = new mraa.Aio(0); //setup access analog input Analog pin #0 (A0)
//var analogValue = analogPin0.read(); //read the value of the analog pin
//console.log(analogValue); //write the value of the analog pin to the console

// end of pot

// ***************************start read button on D2

/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
// Type Node.js Here :)
// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the button object using GPIO pin 0
var button = new groveSensor.GroveButton(2);

// Read the input and print, waiting one second between readings
function readButtonValue() {
    console.log(button.name() + " value is " + button.value());
}
setInterval(readButtonValue, 1000);

// ************************end button


var http = require('http');
http.createServer(function (req, res) {
    var value;
    var img1 = fs.readFileSync('/node_app_slot/Image1.jpg');
    var img2 = fs.readFileSync('/node_app_slot/Image2.jpg'); 
    var img3 = fs.readFileSync('/node_app_slot/Image3.jpg');
    var img4 = fs.readFileSync('/node_app_slot/Image4.jpg');
    // This is a very quick and dirty way of detecting a request for the page
    // versus a request for light values
    if (req.url.indexOf('erosion') != -1) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(lightSensorPage);
	console.log("Hitting erosion");
    }
    else if (req.url.indexOf('teacher') != -1) {
	console.log("Hitting teacher page");
    }
    else if (req.url.indexOf('level1') != -1) {
	console.log("Hitting level1 page");
    }
    else if (req.url.indexOf('level2') != -1) {
	console.log("Hitting level2 page");
    }
    else if (req.url.indexOf('data') != -1) {
        //value = 15;
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(JSON.stringify({erosionLevel:getInclination(), touchSensor:readTouchSensorValue(), floodLevel:analogPin0.read()}));
	console.log("Printing data");
    }
    else if (req.url.indexOf('Image1.jpg') != -1 ) {
	res.writeHead(200, {'Content-Type': 'image/jpg'});
	res.end(img1, 'binary');
	console.log("Image1");
    }
    else if (req.url.indexOf('Image2.jpg') != -1) {
	res.writeHead(200, {'Content-Type': 'image/jpg'});
	res.end(img2, 'binary');
	console.log("Image2");
    }
    else if (req.url.indexOf('Image3.jpg') != -1 ) {

	res.writeHead(200, {'Content-Type': 'image/jpg'});
	res.end(img3, 'binary');
	console.log("Image3");
    }
    else if (req.url.indexOf('Image4.jpg') != -1) {
	res.writeHead(200, {'Content-Type': 'image/jpg'});
	res.end(img4, 'binary');
	console.log("Image4");
    }
    else {
	console.log("Incorrect page ");
    }

}).listen(1337, ipAddress);


console.log("Server running at http:// " + ipAddress + ":1337/");

/**
 * Accelerometer code stop here
 */

/**
 * Given a value, convert it to Lux
 *
 * This uses the table given in the documentation for the 
 * Grove Starter Kit Plus. We have not sought to verify these
 * values with our device. That would be worth doing if you
 * intend to rely on these values. In that case, it could also
 * be worthwhile to improve the interpolation formula
 * @param {Number} - the raw reading from the device

function getLux(analogValue) {
  // Values taken from Grove Starter Kit for Arduino table
  var lux;
  var calib = [{reading:0, lux:0},
               {reading:100, lux:0.2},  // guess - not from published table
               {reading:200, lux:1},
               {reading:300, lux:3},
               {reading:400, lux:6},
               {reading:500, lux:10},
               {reading:600, lux:15},
               {reading:700, lux:35},
               {reading:800, lux:80},
               {reading:900, lux:100}];
  var i = 0;
  while (i < calib.length && calib[i].reading < analogValue) {
    i ++;
  }
  if (i > 0) {
    i = i - 1;
  }
  // simple linear interpolation 
  lux =  (calib[i].lux *(calib[i + 1].reading - analogValue) + calib[i + 1].lux * (analogValue - calib[i].reading))/(calib[i + 1].reading - calib[i].reading);
  return lux;
}



var http = require('http');
http.createServer(function (req, res) {
    var value;
    // This is a very quick and dirty way of detecting a request for the page
    // versus a request for light values
    if (req.url.indexOf('lightsensor') != -1) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(lightSensorPage);
    }
    else {
        value = analogPin0.read();
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(JSON.stringify({lightLevel:getLux(value), rawValue:value}));
    }
}).listen(1337, ipAddress);
*/

/*
function getLux(analogValue) {
  // Values taken from Grove Starter Kit for Arduino table
  var lux;
  var calib = [{reading:0, lux:0},
               {reading:100, lux:0.2},  // guess - not from published table
               {reading:200, lux:1},
               {reading:300, lux:3},
               {reading:400, lux:6},
               {reading:500, lux:10},
               {reading:600, lux:15},
               {reading:700, lux:35},
               {reading:800, lux:80},
               {reading:900, lux:100}];
  var i = 0;
  while (i < calib.length && calib[i].reading < analogValue) {
    i ++;
  }
  if (i > 0) {
    i = i - 1;
  }
  // simple linear interpolation 
  lux =  (calib[i].lux *(calib[i + 1].reading - analogValue) + calib[i + 1].lux * (analogValue - calib[i].reading))/(calib[i + 1].reading - calib[i].reading);
  return lux;
}
*/

