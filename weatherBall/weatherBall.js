const five = require('johnny-five');
const axios = require ('axios');
const queryString = require('query-string');
const moment = require("moment");


const getWeather = async () => {
  // set the Timelines GET endpoint as the target URL
  const getTimelineURL = "https://api.tomorrow.io/v4/timelines";

  // get your key from app.tomorrow.io/development/keys
  const apikey = "PCQluI9RHeKULIcdWVYVCmFYO1NyUW2u";

  // pick the location, as a latlong pair
  let location = [-23.8557, -46.9407];

  // list the fields
  const fields = [
    "precipitationProbability",
    "temperature",
  ];

  // choose the unit system, either metric or imperial
  const units = "metric";

  // set the timesteps, like "current", "1h" and "1d"
  const timesteps = ["1d"];

  // configure the time frame up to 6 hours back and 15 days out
  const now = moment.utc();
  const startTime = moment.utc(now).add(0, "minutes").toISOString();
  const endTime = moment.utc(now).add(1, "days").toISOString();

  // specify the timezone, using standard IANA timezone format
  const timezone = "America/Sao_Paulo";

  // request the timelines with all the query string parameters as options
  const getTimelineParameters =  queryString.stringify({
      apikey,
      location,
      fields,
      units,
      timesteps,
      startTime,
      endTime,
      timezone,
  }, {arrayFormat: "comma"});

  axios.get(getTimelineURL + "?" + getTimelineParameters, {method: "GET"})
    .then((result2) => {
      const board = new five.Board();

      board.on('ready', () => {
        console.log('Powered by Tomorrow.io');
        const rgb = new five.Led.RGB( { pins: [3, 5, 6] });
        const willBeDamp = result2.data.data.timelines[0].intervals[1].values.precipitationProbability > 50;
        const tempDelta = result2.data.data.timelines[0].intervals[1].values.temperature > 25;
  
        if (tempDelta) {
          rgb.color('#ff0000');
        } else {
          rgb.color('#ffffff');
        }
        if (willBeDamp) { rgb.strobe(1000); }
      });
    })
    .catch((error) => console.error("error: " + error));
};

getWeather();
