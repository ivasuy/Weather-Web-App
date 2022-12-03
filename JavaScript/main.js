//get all dom elements
// For Live Projects
window.addEventListener("load", function () {
  document.querySelector("body").classList.add("loaded");

  const app = document.querySelector(".weather-app");
  const temp = document.querySelector(".temp");
  const dateOutput = document.querySelector(".date");
  const timeOutput = document.querySelector(".time");
  const conditionOutput = document.querySelector(".condition");
  const nameOutput = document.querySelector(".name");
  const cloudOutput = document.querySelector(".cloudy");
  const humidityOutput = document.querySelector(".humidity");
  const windOutput = document.querySelector(".wind");
  const form = document.getElementById("locationInput");
  const icon = document.querySelector(".icon");
  const search = document.querySelector(".search");
  const btn = document.querySelector(".submit");
  const cities = document.querySelectorAll(".city");

  //default city when page load
  let cityInput = "Meerut";

  //Add click event listener to each city in the panel
  cities.forEach((city) => {
    city.addEventListener("click", (e) => {
      cityInput = e.target.innerHTML;
      console.log(cityInput);

      /* Function that fetches and displays all the data from the Weather API */
      fetchWeatherData();
      //fade out the app (simple animation)
      app.style.opacity = "0";
    });
  });

  //Add submit event to the form
  form.addEventListener("submit", (e) => {
    if (search.value.length == 0) alert("Please type in a city name");
    else {
      //Change from default city to the entered one
      cityInput = search.value;
      fetchWeatherData();
      search.value = "";
      app.style.opacity = "0";
    }
    e.preventDefault();
  });

  function dayOfTheWeek(day, month, year) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date(`"${year}-${month}-${day}"`).getDay()];
  }

  //Function that feteches and dispay the data using the weather api
  function fetchWeatherData() {
    //fetch the data and dynamically add the city name
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=40e6a410d02e4d77b2c222716221705&q=${cityInput}&aqi=no`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        //adding temperature and weather condition to the page
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        //get date and time from the city and extract day,month,year and time into variables
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        //reformat date
        dateOutput.innerHTML = `${dayOfTheWeek(
          d,
          m,
          y
        )}\u00A0\u00A0 ${d},${m},${y}`;
        timeOutput.innerHTML = time;

        //add the name of the city to the page
        nameOutput.innerHTML = data.location.name;

        //get icon from json
        const iconId = data.current.condition.icon.substr(
          "//cdn.weatherapi.con/weather/64x64/".length
        );

        //reformat the icon url to your own local folder and add it to the page
        icon.src = "./icons/" + iconId;

        //add weather details ot the page
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        //set default time of the day
        let timeOfDay = "day";

        //get the unique id for each weather condition
        const code = data.current.condition.code;

        //change to night if its night time in the city
        if (!data.current.is_day) {
          timeOfDay = "night";
        }

        if (code == 1000) {
          //set bg image to clear if weather is clear
          app.style.backgroundImage = `url(./Images/${timeOfDay}/clear.jpg)`;
          //change button bg if its day or night
          btn.style.background = "#e5ba92";
          if (timeOfDay == "night") {
            btn.style.background = "#181e27";
          }
        }

        //for cloudy weather
        else if (
          code == 1003 ||
          code == 1006 ||
          code == 1009 ||
          code == 1030 ||
          code == 1069 ||
          code == 1087 ||
          code == 1135 ||
          code == 1273 ||
          code == 1276 ||
          code == 1279 ||
          code == 1282
        ) {
          //set bg image to cloudy if weather is cloudy
          app.style.backgroundImage = `url(./Images/${timeOfDay}/cloudy.jpg)`;
          //change button bg if its day or night
          btn.style.background = "#fa6d1b";
          if (timeOfDay == "night") {
            btn.style.background = "#181e27";
          }
        }

        //same for rain
        else if (
          code == 1063 ||
          code == 1069 ||
          code == 1072 ||
          code == 1150 ||
          code == 1180 ||
          code == 1183 ||
          code == 1189 ||
          code == 1192 ||
          code == 1195 ||
          code == 1204 ||
          code == 1207 ||
          code == 1240 ||
          code == 1243 ||
          code == 1246 ||
          code == 1249 ||
          code == 1252
        ) {
          app.style.backgroundImage = `url(./Images/${timeOfDay}/rainy.jpg)`;
          btn.style.background = "#647d75";
          if (timeOfDay == "night") {
            btn.style.background = "#325c80";
          }
        }

        //snow
        else {
          app.style.backgroundImage = `url(./Images/${timeOfDay}/snow.jpg)`;
          btn.style.background = "#4d72aa";
          if (timeOfDay == "night") {
            btn.style.background = "#1b1b1b";
          }
        }

        //fade in the page
        app.style.opacity = "1";
      });

    //if user's typed city doesnt exist throw an alert
    // .catch(() => {
    //   alert("City not found,please try again");
    //   app.style.opacity = "1";
    // });
  }
  fetchWeatherData();
  app.style.opacity = "1";
});
