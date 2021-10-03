const five = require('johnny-five');

const board = new five.Board();

board.on('ready', () => {
  const myServo = new five.Servo(9);

  board.repl.inject({
    servo: myServo,
  });

  myServo.sweep();

  setTimeout(() => {
    myServo.stop();
    myServo.center();
  }, 5000);
});