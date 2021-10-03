const five = require("johnny-five");

const board = new five.Board();

board.on("ready", function() {
  // create the led
  const myLed = new five.Led(9);
  // Create a new `photoresistor` hardware instance.
  const photoresistor = new five.Sensor({
    pin: "A2",
    freq: 250
  });

  // Inject the `sensor` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    pot: photoresistor
  });

  // "data" get the current reading from the photoresistor
  photoresistor.on("data", (value) => {
    // console.log(value);
    var threshold = 750;
    if (value > threshold) {
      myLed.on();
    } else {
      myLed.off();
    }
  });
});