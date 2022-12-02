const apiKey = 'f7577236b82e90879ca7e6c7b2f05c47';
const units = 'metric';

function getCurrentFormatedDate() {
  const now = new Date();
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thurday',
    'Friday',
    'Saturday',
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

  const date = document.querySelector('#date');
  date.innerHTML = `${day}, ${hours}:${minutes}`;
}
getCurrentFormatedDate();

function formatedForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
}
// functions to update userInterface (UI)

function displayForecast(data) {
  console.log(data);
  let dailyForecast = data.daily;
  const forecastElement = document.querySelector('#forecast');
  let forecastHTML = `<div class="row">`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 spacing-small-screen">
    <div class="forcast-date">
    ${formatedForecastDay(forecastDay.dt)}
    </div>
    <img id="forecast-icon" src="http://openweathermap.org/img/wn/${
      forecastDay.weather[0].icon
    }@2x.png" alt="forecast-icon" width="36">
    <span class="forecast-min-temperature"> ${Math.round(
      forecastDay.temp.min
    )}° </span>
    <span class="forecast-max-temperature"> ${Math.round(
      forecastDay.temp.max
    )}° </span>
    </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  console.log(forecastHTML);
}

function displayCurrentWeather(data) {
  const temperature = Math.round(data.main.temp);
  const weatherInfo = data.weather[0].description;
  const humidityInfo = data.main.humidity;
  const windspeedInfo = data.wind.speed;
  const tempMinInfo = Math.round(data.main.temp_min);
  const tempMaxInfo = Math.round(data.main.temp_max);
  const weather = document.querySelector('#weather-info');
  const h3 = document.querySelector('#city-name');
  const temperatureElement = document.querySelector('#temperature');
  const humidity = document.querySelector('#humidity');
  const windspeed = document.querySelector('#windspeed');
  const tempMin = document.querySelector('#temp-min');
  const tempMax = document.querySelector('#temp-max');
  const iconElement = document.querySelector('#icon');
  temperatureElement.innerHTML = `${temperature}`;
  weather.innerHTML = `${weatherInfo}`;
  h3.innerHTML = `${data.name}`;
  humidity.innerHTML = `Humidity: ${humidityInfo} %`;
  windspeed.innerHTML = `Windspeed: ${windspeedInfo} km/h`;
  tempMin.innerHTML = `Minimum: ${tempMinInfo} °C`;
  tempMax.innerHTML = `Maximum: ${tempMaxInfo} °C`;
  iconElement.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
}

//  updating functions (to get data)
async function getForecast(coordinates) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=f7577236b82e90879ca7e6c7b2f05c47&units=${units}`;
  const { data } = await axios.get(apiUrl);
  displayForecast(data);
}
async function updateForCurrentLocation(position) {
  const { latitude, longitude } = position.coords;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  const { data } = await axios.get(apiUrl);
  getForecast(data.coord);
  displayCurrentWeather(data);
}

async function updateForCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f7577236b82e90879ca7e6c7b2f05c47&units=${units}`;
  const { data } = await axios.get(apiUrl);
  displayCurrentWeather(data);
  getForecast(data.coord);
}
// utility functions

// clickHandlers

function currentLocationButtonHandler(event) {
  navigator.geolocation.getCurrentPosition(updateForCurrentLocation);
}
function submitButtonHandler(event) {
  event.preventDefault();
  const cityInput = document.querySelector('#city-input');
  updateForCity(cityInput.value);
}
const submitButton = document.querySelector('#submit-form');
submitButton.addEventListener('submit', submitButtonHandler);
document.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    submitButtonHandler(event);
  }
});

const currentLocationButton = document.querySelector('#location-button');
currentLocationButton.addEventListener('click', currentLocationButtonHandler);

// default city on load
updateForCity('Berlin');
