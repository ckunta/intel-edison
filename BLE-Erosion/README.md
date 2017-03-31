Intel® XDK IoT Node.js\* BLE Peripheral App
===========================================

See [LICENSE.md](LICENSE.md) for license terms and conditions.

See also, the
[mraa library documentation](https://iotdk.intel.com/docs/master/mraa/index.html)
for details regarding supported boards and the mraa library API and the
[upm library documentation](https://iotdk.intel.com/docs/master/upm/) for
information regarding the upm sensor and actuator library APIs.

App Overview
------------

A simple nodeJS project that uses the bleno node module on Intel Edison
and corresponding characteristic for Bluetooth Low Energy (BLE) communication.


#### First time - Enabling BLE

Within a SSH or Serial Terminal connection, type the following commands,
```
rfkill unblock bluetooth
hciconfig hci0 up

vi /etc/opkg/base-feeds.conf (insert only following lines)
src/gz all http://repo.opkg.net/edison/repo/all
src/gz edison http://repo.opkg.net/edison/repo/edison
src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32
```
*For more information on the vi editor, visit* http://www.cs.colostate.edu/helpdocs/vi.html

```
opkg update
opkg install bluez5-dev
```

**Note:** If bluez fails to install this version, still proceed with remainding steps.

#### Prerequisite for Bleno - node package to work successfully

**Note:** The following steps will need to be executed every time the board is restarted.
Within a SSH or Serial Terminal connection, type the following commands,
```
rfkill unblock bluetooth
killall bluetoothd (or, more permanently) systemctl disable bluetooth
hciconfig hci0 up
```

##### Design Considerations

The **first operation** is to set up an eventlistener for the "stateChange" event. Within this function block, it is recommended to startAdvertising your service only when the state is in powerOn.

The **second operation** is to set up an eventlistener for the "advertisingStart" event. Within this function block, set your primary service with it's unique UUID and characteristics attributes.

**Service Characteristic setup**

**Communication request handlers for the BLE peripheral can be managed by the following functions:**

The **third operation** is to set up an eventlisrerner for the "connect" and "disconnect" event.

Important App Files
-------------------

* main.js
* characteristic.js
* package.json

Important Project Files
-----------------------

* README.md
* LICENSE.md
* \<project-name\>.xdk

Tested IoT Node.js Platforms
----------------------------

* [Intel® Edison Development Platform](http://intel.com/edison)

This sample can run on other IoT [Node.js](http://nodejs.org) development
platforms, that include the appropriate sensor hardware, but may require
changes to the I/O initialization and configuration code in order to work on
those other platforms.
