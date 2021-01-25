# nodeapi-ruuvitag

nodeapi-ruuvitag provides an access to [RuuviTag BLE Sensor Beacons](http://ruuvitag.com/) and reading/parsing data to JSON format.

### Prerequisites
* RuuviTag sensor(s)
    * Supports [Data Format 3 (RAWv1) and Data Format 5 (RAWv2)](https://github.com/ruuvi/ruuvi-sensor-protocols)
* V8 JavaScript engine [Node.js](https://nodejs.org)
* [@abandonware/noble](https://www.npmjs.com/package/@abandonware/noble)
* Superuser rights

### Installing
* Clone this repository
* cd into the cloned repository
* Intall the dependencies: 
```sh
$ npm install
```

### Usage
Run the application server with the following command and then go to address: http://localhost:3001
```sh
$ node index.js
```

If you run into problems with permissions, try

```sh
$ sudo node index.js
```

Also print the data to the console using command
```sh
$ node index.js -v
```

Same notation for permissions applies here.

#### Data Formats
* Example JSON for Data Format 5 (RAWv2), and with extended hardcoded values to match that of the Ruuvi Station gateway:
```json
"tags": [
    {
    "accelX": "Number",
    "accelY": "Number",
    "accelZ": "Number",
    "connectable": "Boolean",
    "createDate": "Date",
    "dataFormat": "Number",
    "defaultBackground": "Number",
    "favorite": "Boolean",
    "humidity": "Number",
    "humidityOffset": "Number",
    "id": "String",
    "measurementSequenceNumber": "Number",
    "movementCounter": "Number",
    "name": "String",
    "pressure": "Number",
    "rssi": "Number",
    "temperature": "Number",
    "txPower": "Number",
    "updateAt": "String",
    "voltage": "Number"
    }
],
"batteryLevel": "Number",
"deviceId": "String",
"eventId": "String",
"time": "String"
```

## License
Licensed under the [MIT](./LICENSE) License.
