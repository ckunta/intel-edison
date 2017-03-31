/*jslint node:true,vars:true,bitwise:true,unparam:true */
/*jshint unused:true */
/*jshint esnext: true */

"use strict";

var EventEmitter = require('events');

var mraa = require('mraa');

var interval;
var analogPin;

class Sensor extends EventEmitter {

  constructor(){
    super();
    // start of pot
    console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console
    analogPin = new mraa.Aio(0); //setup access analog input Analog pin #0 (A0)
  }

  start(){
    console.log('Start potentiometer reading');
    var self = this;
    var delay = 1000; //milliseconds
    interval = setInterval(function() {
      self.emit('ready', analogPin.read());
    }, delay);
  }

  stop(){
    clearInterval(interval);
    console.log("Exiting ..");
  }

// end of pot

}

/*
   var events = require('events');
   var util = require('util');


function Sensor() {
  events.EventEmitter.call(this);
}

util.inherits(Sensor, events.EventEmitter);
**
 * Accelerometer code starts here
 *
* var digitalAccelerometer = require('jsupm_mma7660');
 * 
 * // Instantiate an MMA7660 on I2C bus 0
 * var myDigitalAccelerometer = new digitalAccelerometer.MMA7660(
 *     digitalAccelerometer.MMA7660_I2C_BUS, 
 *     digitalAccelerometer.MMA7660_DEFAULT_I2C_ADDR);
 * 
 * 
 * 
 * 
 *         
 *       // place device in standby mode, no valid data in registers, and the only way to write a register
 *       myDigitalAccelerometer.setModeStandby();
 * 
 *       // enable 64 samples per second
 *       myDigitalAccelerometer.setSampleRate(digitalAccelerometer.MMA7660.AUTOSLEEP_64);
 * 
 *       // place device into active mode
 *       myDigitalAccelerometer.setModeActive();
 * 
 * 
 * var x, y, z;
 *       x = digitalAccelerometer.new_intp();
 *       y = digitalAccelerometer.new_intp();
 *       z = digitalAccelerometer.new_intp();
 *     
 *  
 * Sensor.prototype.start = function() {
 *     
 *     console.log('Start sensor reading');
 *     var self = this;
 *     var delay = 1000; // milliseconds, ie 1 sec
 *     setInterval(function(){
 *       myDigitalAccelerometer.getRawValues(x, y, z);
 *       self.emit('ready', digitalAccelerometer.intp_value(x));
 *     }, delay);
 *   };*/



  /* function getInclination() {
   *   var tilt;
   *   myDigitalAccelerometer.getRawValues(x, y, z);
   *   
   *   tilt = digitalAccelerometer.intp_value(x);
   *   console.log("Value of tilt is " + tilt);
   *   return tilt;
   * }*/

// end of accelerometer 



//TODO with OOP
//TODO replace with getInclination

/*
* OOP approach
*
 * var PizzaBakeResult = {
 *   HALF_BAKED: 0,
 *   BAKED:      1,
 *   CRISPY:     2,
 *   BURNT:      3,
 *   ON_FIRE:    4
 * };


   class Sensor extends EventEmitter {

 * bake(temperature) {
 *   var time = temperature * 100;
 *   var delay = 500;
 *   var self = this;
 *   console.log('baking pizza at', temperature, 'degrees for', time, 'milliseconds');
 *   setInterval(function() {
 *     var result =
 *       (temperature < 1) ? PizzaBakeResult.HALF_BAKED:
 *       (temperature < 20) ? PizzaBakeResult.BAKED:
 *       (temperature < 100) ? PizzaBakeResult.CRISPY:
 *       (temperature < 200) ? PizzaBakeResult.BURNT:
 *       PizzaBakeResult.ON_FIRE;
 *     self.emit('ready', result);
 *   }, delay);
 *   
 * };
   }*/

/* 
 * non OOP approach
 *
var PizzaBakeResult = {
  HALF_BAKED: 0,
  BAKED:      1,
  CRISPY:     2,
  BURNT:      3,
  ON_FIRE:    4
};


function Sensor() {
    events.EventEmitter.call(this);
}

util.inherits(Sensor, events.EventEmitter);

Sensor.prototype.bake = function(temperature) {
  var time = temperature * 100;
  var self = this;
  console.log('baking pizza at', temperature, 'degrees for', time, 'milliseconds');
  setTimeout(function() {
    var result =
      (temperature < 1) ? PizzaBakeResult.HALF_BAKED:
      (temperature < 20) ? PizzaBakeResult.BAKED:
      (temperature < 100) ? PizzaBakeResult.CRISPY:
      (temperature < 200) ? PizzaBakeResult.BURNT:
      PizzaBakeResult.ON_FIRE;
    self.emit('ready', result);
  }, time);
};

*/

module.exports = Sensor;





