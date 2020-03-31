const noble = require('@abandonware/noble');
const dateFormat = require('dateformat');
const http = require('http');

const sensorData = require('./sensorData');

const verbose = (process.argv[2] == '-v' || process.argv[2] == '-V');

const sensors = [];

noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
        noble.startScanning([], true);
        if (verbose) {
            console.log('\nFinding..\n');
        };
    } else {
        noble.stopScanning();
        console.log('\nBluetooth power off!\n');
        process.exit(1);
    }
});

noble.on('discover', (peripheral) => {

    if (peripheral.advertisement.manufacturerData) {

        const rawData = peripheral.advertisement.manufacturerData.toString('hex');

        //RuuviTag sensors (9904: Manufacturer: Ruuvi Innovations)
        if (rawData.length >= 4) {
            if (rawData.substring(0, 4) == '9904') {

                //Sensor data..
                const sensor = {
                    'id': peripheral.id,
                    'address': peripheral.address,
                    'rssi': peripheral.rssi,
                    'timestamp': dateFormat(Date(), 'dd.mm.yyyy HH:MM:ss'),
                    'rawdata': rawData,
                    'data': sensorData.decode(rawData)
                };

                //Add or update
                const index = sensors.findIndex(x => x.id === sensor.id);
                if (index == -1) {
                    //Add new
                    sensors.push(sensor);
                } else {
                    //Update existing
                    sensors[index] = sensor;
                };

                if (verbose) {
                    console.clear();
                    console.log('Sensors:\n');
                    console.log(sensors);
                    console.log();
                };
            };
        };
    };
});

process.on('SIGINT', () => {
    noble.stopScanning();
    console.log('\nTerminated..\n');
    process.exit(1);
});

const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(sensors))
})

const port = 3001
app.listen(port)
console.log(`\nhttp server running on port: ${port}`)