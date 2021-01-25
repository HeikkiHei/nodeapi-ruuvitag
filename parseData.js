//Decode sensor data

const rshift = (value, n) => (value % 0x100000000) >> n

const twosComplement = (value, bits) => ((value & (1 << (bits - 1))) != 0) ? value = (value - (1 << bits)) : value

const decode = (rawData) => {
  //Select decoder
  if (rawData.length >= 6) {
    if (rawData.substring(0, 4) == '9904') {
      const format = parseInt(rawData.substring(4, 6), 16)
      if (format == 5) {
        return decodeDF5(rawData)
      }
    }
  }
  return {}
}

const decodeDF5 = (rawData) => {

  //Data Format 5 (RAWv2)

  const temperature = (rawTemp) => rawTemp != 0x8000 ? twosComplement(rawTemp, 16) / 200 : undefined

  const humidity = (rawHumidity) => rawHumidity != 0xFFFF ? rawHumidity / 400 : undefined

  const pressure = (rawPressure) => rawPressure != 0xFFFF ? (rawPressure + 50000) / 100 : undefined


  const acceleration = (rawAcc) => rawAcc != 0x8000 ? twosComplement(rawAcc, 16) / 1000 : undefined

  const voltage = (rawPowerinfo) => {
    const rawVoltage = rshift(rawPowerinfo, 5)
    if (rawVoltage != 0x7FF) {
      return (rawVoltage + 1600) / 1000
    }
    return undefined
  }

  const txpower = (rawPowerinfo) => {
    const rawPower = rawPowerinfo & 0x1F
    if (rawPower != 0x1F) {
      return rawPower * 2 - 40
    }
    return undefined
  }

  const movementcounter = (rawMovecount) => rawMovecount != 0xFF ? rawMovecount : undefined

  const measurementsequencenumber = (rawSeqnum) => rawSeqnum != 0xFFFF ? rawSeqnum : undefined
  
  

  if (rawData.length === 52) {

    const format = parseInt(rawData.substring(4, 6), 16)
    if (format == 5) {

      const acc_x = acceleration(parseInt(rawData.substring(18, 22), 16))
      const acc_y = acceleration(parseInt(rawData.substring(22, 26), 16))
      const acc_z = acceleration(parseInt(rawData.substring(26, 30), 16))
      
      // parse mac address
      const macAddress = rawData.substring(40).match(/.{1,2}/g).join(':').toUpperCase()

      return {
        'accelX': acc_x,
        'accelY': acc_y,
        'accelZ': acc_z,
        'connectable': false,
        'createDate': new Date().toISOString(),
        'dataFormat': format,
        'defaultBackground': 4,
        'favorite': true,
        'humidity': humidity(parseInt(rawData.substring(10, 14), 16)),
        'humidityOffset': 0,
        'id': macAddress,
        'measurementSequenceNumber': measurementsequencenumber(parseInt(rawData.substring(36, 40), 16)),
        'movementCounter': movementcounter(parseInt(rawData.substring(34, 36), 16)),
        'name': '',
        'pressure': pressure(parseInt(rawData.substring(14, 18), 16)),
        'temperature': temperature(parseInt(rawData.substring(6, 10), 16)),
        'txPower': txpower(parseInt(rawData.substring(30, 34), 16)),
        'updateAt': new Date().toISOString(),
        'voltage': voltage(parseInt(rawData.substring(30, 34), 16))
      }
    }
  }
  return {}
}

exports.decode = decode