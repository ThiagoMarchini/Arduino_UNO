const five = require('johnny-five');
const Oled = require('oled-js');

const board = new five.Board();
const width = 128;
const height = 64;
const tileSize = 16;


const Vector = () => {
  return { x: 0, y: 0 };
}

const createTile = (tile, screen) => {
  const num = Math.random();
  const lineStart = Vector();
  const lineEnd = Vector();

  // Forward slash
  if (num > 0.5) {
    lineStart.x = tile.x;
    lineStart.y = tile.y + tileSize - 1;
    lineEnd.x = tile.x + tileSize - 1;
    lineEnd.y = tile.y;
  //back slash
  } else {
    lineStart.x = tile.x;
    lineStart.y = tile.y;
    lineEnd.x = tile.x + tileSize - 1;
    lineEnd.y = tile.y + tileSize - 1;
  }
  screen.drawLine(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y, 1, false);
}

const createArt = (screen) => {
  for (let i = 0; i < width; i += tileSize) {
    for (let j = 0; j < height; j += tileSize) {
      const tile = Vector();
      tile.x = i;
      tile.y = j;
      createTile(tile, screen);
    };
  };
  screen.update();
};

// Endereço I2C 0x3C

board.on('ready', () => {
  console.log('Connected to the Arduino UNO');

  const options = {
    width,
    height,
    address: 0x3C,
  };

  const screen = new Oled(board, five, options);
  screen.clearDisplay();
  screen.update();
  // Draw a line: (startX, startY, endX, endY, color)
  // screen.drawLine(0, 0, 60, 12, 255);
  createArt(screen);
})