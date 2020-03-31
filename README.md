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
$ sudo node index.js
```

Also print the data to the console using command
```sh
$ sudo node index.js -v
```

#### Data Formats
* Example JSON for Data Format 5 (RAWv2). Data Format 3 (RAWv1) doesn't contain txpower, movementcount and measurementseqcount. 
```json
[
    {
        id: "ea7fb5add1ca",
        address: "ea:7f:b5:ad:d1:ca",
        rssi: -57,
        timestamp: "29.03.2020 20:39:24",
        rawdata: "99040511522160c53b0000ffcc03e4c5b63e696cea7fb5adb1da",
        data: {
            format: 5,
            temp: 22.17,
            humidity: 21.36,
            pressure: 1004.91,
            acceleration: 0.997,
            accererations: {
                x: 0,
                y: -0.052,
                z: 0.996
            },
            voltage: 3.181,
            txpower: 4,
            movementcount: 62,
            measurementseqcount: 26988
        }
    }
]
```

## License
Licensed under the [MIT](./LICENSE) License.
