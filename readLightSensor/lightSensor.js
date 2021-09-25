const five = require('johnny-five');

const board = new five.Board();

board.on('ready', () => {
  const sensor = new five.Sensor({
    pin: 'A0',
    freq: 1000,
  });
  console.log(sensor);
  const led = new five.Led(11);
  led.off();
  sensor.on('data', () => {
    // console.log(sensor.value);

    if (sensor.value < 200) {
      led.on();
    } else {
      led.off();
    }
  });
})