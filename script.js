const apiKey = "f7577236b82e90879ca7e6c7b2f05c47";
const units = "metric";
let celsiusTemperature;

function getCurrentFormatedDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thurday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  const date = document.querySelector("#date");
  date.innerHTML = `${day}, ${hours}:${minutes}`;
}
function search(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f7577236b82e90879ca7e6c7b2f05c47&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

getCurrentFormatedDate();
// toDo:
// make functions more modular
// make updateWeather more readable, timm it a little maybe
// add unit convention
function updateWeather(response) {
  // console.log(response);
  const temperature = Math.round(response.data.main.temp);
  const weatherInfo = response.data.weather[0].description;
  const humidityInfo = response.data.main.humidity;
  const windspeedInfo = response.data.wind.speed;
  const tempMinInfo = Math.round(response.data.main.temp_min);
  const tempMaxInfo = Math.round(response.data.main.temp_max);
  const weather = document.querySelector("#weather-info");
  const h3 = document.querySelector("#city-name");
  const temperatureElement = document.querySelector("#temperature");
  const humidity = document.querySelector("#humidity");
  const windspeed = document.querySelector("#windspeed");
  const tempMin = document.querySelector("#temp-min");
  const tempMax = document.querySelector("#temp-max");
  const iconElement = document.querySelector("#icon");
  temperatureElement.innerHTML = `${temperature}`;
  weather.innerHTML = `${weatherInfo}`;
  h3.innerHTML = `${response.data.name}`;
  humidity.innerHTML = `Humidity: ${humidityInfo} %`;
  windspeed.innerHTML = `Windspeed: ${windspeedInfo} km/h`;
  tempMin.innerHTML = `Minimum: ${tempMinInfo} °C`;
  tempMax.innerHTML = `Maximum: ${tempMaxInfo} °C`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}

function changeToCityInput(event) {
  event.preventDefault();
  const cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}

async function showLocation(position) {
  const { latitude, longitude } = position.coords;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  const weatherObject = await axios.get(apiUrl);
  search(weatherObject.data.name);
}
function currentLocationButtonHandler(position) {
  navigator.geolocation.getCurrentPosition(showLocation);
}

const submitButton = document.querySelector("#submit-form");
submitButton.addEventListener("submit", changeToCityInput);
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    changeToCityInput(event);
  }
});
const currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", currentLocationButtonHandler);

search("Berlin");

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  const temperatureElement = document.querySelector("#temperature");
  celsiusTemperature = +temperatureElement.innerHTML;
  const fahrenheitTemperature = `${
    (temperatureElement.innerHTML * 9) / 5 + 32
  }`;
  temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}`;
}
function displayCelsiusTemperature(event) {
  event.preventDefault();
  const temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${celsiusTemperature}`;
}

const fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

const celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);
