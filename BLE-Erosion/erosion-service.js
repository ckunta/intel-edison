/*jslint node:true,vars:true,bitwise:true,unparam:true */
/*jshint unused:true */
/*jshint esnext: true */

"use strict";

//var util = require('util');
var bleno = require('bleno');

var ErosionCharacteristic = require('./characteristic');

//TODO replace sensor with product name

class ErosionService extends bleno.PrimaryService {
  constructor(sensor) {
    super({
      uuid: '5ab2fffeb3554d8a96ef2963812dd0b8',
      characteristics: [
	new ErosionCharacteristic(sensor)
      ]
    });
    console.log('Service started');
  }
}

module.exports = ErosionService;


/* var BlenoPrimaryService = bleno.PrimaryService;
 * 
 * function ErosionService(sensor) {
 *   new BlenoPrimaryService({
 *     uuid: '5ab2fffeb3554d8a96ef2963812dd0b8',
 *     characteristics: [
 *       new ErosionCharacteristic(sensor)
 *     ]
 *   });
 * }
 * 
 * util.inherits(ErosionService, bleno.PrimaryService);
 * 
 * module.exports = ErosionService;*/


/* var PizzaCrustCharacteristic = require('./pizza-crust-characteristic');
 * var PizzaToppingsCharacteristic = require('./pizza-toppings-characteristic');
 * var PizzaBakeCharacteristic = require('./pizza-bake-characteristic');
 * 
 * function PizzaService(pizza) {
 *   bleno.PrimaryService.call(this, {
 *     uuid: '13333333333333333333333333333337',
 *     characteristics: [
 *       new PizzaCrustCharacteristic(pizza),
 *       new PizzaToppingsCharacteristic(pizza),
 *       new PizzaBakeCharacteristic(pizza)
 *     ]
 *   });
 * }
 * 
 * util.inherits(PizzaService, bleno.PrimaryService);
 * 
 * module.exports = PizzaService;*/


