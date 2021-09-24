const five = require('johnny-five');

const board = new five.Board();

board.on('ready', () => {
  const led = new five.Led(13);
  let blinkCount = 0;
  const maxCount = 10;

  led.blink(900, () => {
    blinkCount += 1;
    console.log(`Piscadas: ${blinkCount}`);
    if (blinkCount >= maxCount) {
      console.log('Vou parar de piscar agora!');
      led.stop();
    }
  })
})