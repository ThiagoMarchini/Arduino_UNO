const five = require('johnny-five');

const board = new five.Board();

board.on('ready', () => {
  const led = new five.led();
  led.blink(500);
})