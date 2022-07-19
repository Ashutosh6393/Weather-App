const bodyParser = require("body-parser");
const { response } = require("express");
const express = require("express");
const { connect } = require("http2");
const https = require("https");
const { send } = require("process");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {   
    display: 0,
    statusCode: 200,
    temperature: 0.0,
    desc: "-",
    wind: 0,
    humidity: 0.0,
    maxtemp: 0.0,
    mintemp: 0.0,
    icon: "",
    city:''
  });
});


app.get('*',(req, res)=>{
  res.send('<h1>Sorry! page not available</h1>');

});


app.post("/", (req, res) => {
  const cityName = req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=6b638b00f9437e6068253b8aa946a046&units=metric`;

  https.get(url, (response) => {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const code = weatherData.cod;
      // console.log(weatherData);
      if (code === 200) {
        const icon = weatherData.weather[0].icon;
        const desc = weatherData.weather[0].description;
        const temperature = Math.floor(weatherData.main.temp);
        const maxTemp = Math.floor(weatherData.main.temp_max);
        const minTemp = Math.floor(weatherData.main.temp_min);
        const wind = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const city = weatherData.name;

        res.render("index", {
          display: 1,
          statusCode: code,
          temperature: temperature,
          desc: desc,
          wind: wind,
          humidity: humidity,
          maxtemp: maxTemp,
          mintemp: minTemp,
          city:city,
          icon: `http://openweathermap.org/img/wn/${icon}@4x.png`,
        });
      } else {
        res.render("index", {
          display: 0,
          statusCode: code,
          temperature: 0.0,
          desc: "-",
          wind: 0,
          humidity: 0.0,
          maxtemp: 0.0,
          mintemp: 0.0,
          icon: "",
          city:''
        });
      }
    });
  });
});

app.listen(process.env.PORT ||3000, () => console.log("server started at port 3000"));
