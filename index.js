const noble = require('@abandonware/noble')
// const dateFormat = require('dateformat')
const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')

app.use(express.json())
app.use(cors())

// Original data parser:
// const sensorData = require('./sensorData')

// Modified for our data type
const sensorData = require('./parseData')

const verbose = (process.argv[2] == '-v' || process.argv[2] == '-V')

noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
        noble.startScanning([], true)
        if (verbose) {
            console.log('\nFinding..\n')
        }
    } else {
        noble.stopScanning()
        console.log('\nBluetooth power off!\n')
        process.exit(1)
    }
})

noble.on('discover', (peripheral) => {
    if (peripheral.advertisement.manufacturerData) {

        const rawData = peripheral.advertisement.manufacturerData.toString('hex')
        //RuuviTag sensors (9904: Manufacturer: Ruuvi Innovations)
        if (rawData.length >= 4) {
            if (rawData.substring(0, 4) == '9904') {

                //Sensor data...
                const sensor = {
                    'eventId': peripheral.id,
                    'deviceId': peripheral.address,
                    'time': new Date().toISOString(),
                    'batteryLevel': 0,
                    'tags': [sensorData.decode(rawData)]
                }
                sensor.tags.rssi = peripheral.rssi
                

                // Send data to server
                axios
                    .post('https://ruuvi-backend.herokuapp.com/api/ruuvis', sensor)
                    .then(response =>
                        console.log(response))
                    .catch(error => console.log(sensor, error.toJSON()))
            }
        }
    }
})

process.on('SIGINT', () => {
    noble.stopScanning()
    console.log('\nTerminated..\n')
    process.exit(1)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`\nGateway running on port: ${PORT}`)
})
