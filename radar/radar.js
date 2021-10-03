var five = require("johnny-five");
const child = require("child_process");
const cors = require('cors');
const http = require("http");
const socket = require("socket.io");
const fs = require("fs");
let app, board;
const { Server } = require("socket.io");

function handler(req, res) {
  var path = __dirname;

  if (req.url === "/") {
    path += "/radar.html";
  } else {
    path += req.url;
  }

  fs.readFile(path, function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading " + path);
    }

    res.writeHead(200);
    res.end(data);
  });
}

app = http.createServer(handler);
app.listen(3000);

const io = new Server();
io.use(cors());
io.listen(app);

board = new five.Board();

board.on("ready", function() {
  let center, degrees, step, facing, range, scanner, soi, ping, last;


  // Open Radar view
  child.exec("open http://localhost:3000/");

  // Starting scanner scanning position (degrees)
  degrees = 1;

  // Servo scanning steps (degrees)
  step = 1;

  // Current facing direction
  facing = "";

  last = 0;

  // Scanning range (degrees)
  range = [0, 170];

  // Servo center point (degrees)
  center = range[1] / 2;

  // ping instance (distance detection)
  // ping = new five.Ping(7);

  const proximity = new five.Proximity({
    controller: "HCSR04I2CBACKPACK",
    freq: 100,
  });

  // Servo instance (panning)
  scanner = new five.Servo({
    pin: 12,
    range: range
  });

  this.repl.inject({
    scanner: scanner
  });

  // Initialize the scanner servo at 0°
  scanner.min();

  // Scanner/Panning loop
  this.loop(100, function() {
    var bounds, isOver, isUnder;

    bounds = {
      left: center + 5,
      right: center - 5
    };

    isOver = degrees > scanner.range[1];
    isUnder = degrees <= scanner.range[0];

    // Calculate the next step position
    if (isOver || isUnder) {
      if (isOver) {
        io.sockets.emit("reset");
        degrees = 0;
        step = 1;
        last = -1;
      } else {
        step *= -1;
      }
    }

    // Update the position by N° step
    degrees += step;

    // Update servo position
    scanner.to(degrees);
  });

  io.sockets.on("connection", function(socket) {
    console.log("Socket Connected");

    soi = socket;

    proximity.on("data", function() {

      if (last !== degrees) {
        io.sockets.emit("ping", {
          degrees: degrees,
          distance: proximity.centimeters,
        });
      }

      last = degrees;
    });
  });
});
