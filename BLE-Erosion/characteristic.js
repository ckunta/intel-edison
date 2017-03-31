/*jslint node:true,vars:true,bitwise:true,unparam:true */
/*jshint unused:true */
/*jshint esnext: true */

"use strict";

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

class ErosionCharacteristic extends BlenoCharacteristic {
      constructor(sensor){
        super({
          uuid: '5ab2000ab3554d8a96ef2963812dd0b8',
          properties: ['read', 'notify', 'write'],
          value: null,
          descriptors: [
            new bleno.Descriptor({
              uuid: '2901',
              value: 'Update on erosion characteristic.'
            })
          ]
        });
    
    this.sensor = sensor;

    this._value = new Buffer("Erosion accelerometer charateristic", "utf-8");
    console.log("Characterisitic's value: "+this._value);
    
    this._updateValueCallback = null;        
  }
  
  onReadRequest(offset, callback) {

    //this._value = sensor.getInclination();
    console.log('ErosionCharacteristic - onReadRequest: value = ' + this._value);
    
    callback(this.RESULT_SUCCESS, this._value);    
  }

  onWriteRequest(data, offset, withoutResponse, callback) {

    if (offset) {
      console.log('result attr not long ' + offset);
      callback(this.RESULT_ATTR_NOT_LONG);
    }
    else if (data.length !== 1) {
      console.log('result invalid attribute length ' + data.length);
      callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
      console.log('receiving onWriteRequest: ' + data.readUInt8(0));

      /* var temperature = data.readUInt8(0);
       * var self = this;
       * var thissensor = this.sensor;
       * var count = 0;
       * console.log('receiving onWriteRequest: ' + temperature);
       * thissensor.on('ready', function(result) {
       *   console.log('pizza is ready with result ' + result);
       *   if (self._updateValueCallback) {
       *     var data = new Buffer(1);
       *     data.writeUInt8(result, 0);
       *     self._updateValueCallback(data);
       *   }
       *   if (count++ > 10) {
       *     console.log('stop listening');
       *     debugger;
       *     thissensor.removeAllListeners('ready');
       *   }
       * });

       * thissensor.bake(temperature);
       * */
        callback(this.RESULT_SUCCESS);
    }
  }

  
  onNotify() {
    //this._value = sensor.getInclination();
    //this._value = new Buffer(getData());
    
    console.log('ErosionCharacteristic - onNotify: value = ' + this._value);    
  }
  

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('ErosionCharacteristic - onSubscribe');
    console.log('Max value size ' + maxValueSize);
    this._updateValueCallback = updateValueCallback;

    var self = this;

    this.sensor.on('ready', function(result) {
      console.log('potentiometer value is ' + result);
      if (self._updateValueCallback) {
       var data = new Buffer(2); //2 bytes hence UInt16
	   
       data.writeUInt16BE(result, 0);
       console.log('sent data ' + data.readUInt16BE(0));
	   self._updateValueCallback(data);
      }
    });
    this.sensor.start();
  }

  onUnsubscribe() {
    console.log('ErosionCharacteristic - onUnsubscribe');

    this._updateValueCallback = null;

    this.sensor.removeAllListeners('ready');
  }
  
}


module.exports = ErosionCharacteristic;
    
    

