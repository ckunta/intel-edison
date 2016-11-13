var ipAddress = '192.168.43.198';


// Start by loading in some data
var fs = require('fs'),
	path = require('path');

var erosionPage = fs.readFileSync('/node_app_slot/erosionlogic.html');

// Insert the ip address in the code in the page
erosionPage = String(erosionPage).replace(/<<ipAddress>>/, ipAddress);


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
        // console.log("Value of tilt is " + tilt);
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
        //console.log(touch.name() + " is pressed");
        return 1;
    } else {
        //console.log(touch.name() + " is not pressed");
        return 0;
    }
    
}
//setInterval(readSensorValue, 1000);


// end of touch sensor

// start of pot

var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var analogPin0 = new mraa.Aio(0); //setup access analog input Analog pin #0 (A0)
function readPotentio(){
    return analogPin0.read(); //read the value of the analog pin
    //console.log(analogValue); //write the value of the analog pin to the console
}

// end of pot

// ***************************start read button on D2

/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
// Leave the above lines for propper jshinting
// Type Node.js Here :)
// Load Grove module
var groveSensor = require('jsupm_grove');

// Create the button object using GPIO pin 8
var button = new groveSensor.GroveButton(8);


// Read the input and print, waiting one second between readings
function getSubstrateType(type) {
    //console.log(button.name() + " value is " + button.value());
    if (button.value() == 1) {
	type = (type + 1) % 2;
	console.log("substratetype changed " + type);
    }

    return type;

}
//setInterval(readButtonValue, 1000);

// ************************end button

var substrateType = 0;    
var http = require('http');
http.createServer(function (req, res) {

    var value;
    if (req.url.indexOf('erosion') != -1) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(erosionPage);
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
        res.writeHead(200, {'Content-Type': 'text/json'});
	substrateType = getSubstrateType(substrateType);
        res.end(JSON.stringify({erosionLevel:getInclination(), 			touchSensor:readTouchSensorValue(), floodLevel:readPotentio(), erosionSubstrate:substrateType}));
	console.log("Inclination " + getInclination() + 
		    " Flood level " + readPotentio() + 
		    " Erosion substrate " + substrateType + 
		    " Touch " + readTouchSensorValue());

    } else if (req.url.indexOf(".mp4") != -1) {
	var file = path.resolve(__dirname, "/node_app_slot/" + req.url);
	fs.stat(file, function(err, stats) {
	    if (err) {
		if (err.code === 'ENOENT') {
		    // 404 Error if file not found
		    return res.sendStatus(404);
		}
		res.end(err);
	    }
	    var range = req.headers.range;
	    console.log("range is " + range);
	    if (!range) {
		// 416 Wrong range
		return res.sendStatus(416);
	    }
	    var positions = range.replace(/bytes=/, "").split("-");
	    var start = parseInt(positions[0], 10);
	    var total = stats.size;
	    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
	    var chunksize = (end - start) + 1;

	    res.writeHead(206, {
		"Content-Range": "bytes " + start + "-" + end + "/" + total,
		"Accept-Ranges": "bytes",
		"Content-Length": chunksize,
		"Content-Type": "video/mp4"
	    });

	    var stream = fs.createReadStream(file, { start: start, end: end })
		.on("open", function() {
		    stream.pipe(res);
		}).on("error", function(err) {
		    res.end(err);
		});
	});
    }

    else if (req.url.indexOf('.jpg') != -1) {
	console.log(req.url);
	var img = fs.readFileSync('/node_app_slot/' + req.url);
	res.writeHead(200, {'Content-Type': 'image/jpg'});
	res.end(img, 'binary');
    }
    
    else if (req.url.indexOf('inclination') != -1) { 
	    myDigitalAccelerometer.getRawValues(x, y, z);
        
        var xval = digitalAccelerometer.intp_value(x);
        var yval = digitalAccelerometer.intp_value(y);
        var zval = digitalAccelerometer.intp_value(z);
        var gravity = readPotentio() > 500 ? 1.6 : 9.8;
        
        res.end('{ "x": ' + xval + ', "y": ' + yval + ', "z": ' + zval + ', "gravity": ' + gravity + ' }');
    }

    else {
	console.log("Incorrect page, url is  " + req.url);
    }

}).listen(1337, ipAddress);


console.log("Server running at http:// " + ipAddress + ":1337/");


