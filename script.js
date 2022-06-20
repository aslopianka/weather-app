const apiKey = "f7577236b82e90879ca7e6c7b2f05c47";
const units = "metric";

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
  let minutes = now.getMinutes();
  const date = document.querySelector("#date");
  date.innerHTML = `${day}, ${hours}:${minutes}`;
}
getCurrentFormatedDate();

function updateWeather(response) {
  const temperature = Math.round(response.data.main.temp);
  const temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${temperature} °C`;
  const weather = response.data.weather[0].description;
  const weatherInfo = document.querySelector("#weather-info");
  weatherInfo.innerHTML = `${weather}`;
  const h3 = document.querySelector("#city-name");
  h3.innerHTML = `${response.data.name}`;
}

// city input from api rather than city input, because gives cleaner name
function changeToCurrentCity(event) {
  event.preventDefault();
  const cityInput = document.querySelector("#city-input");
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=f7577236b82e90879ca7e6c7b2f05c47&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

async function showLocation(position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  const weatherObject = await axios.get(apiUrl);
  const cityName = document.querySelector("#city-name");
  cityName.innerHTML = `${weatherObject.data.name}`;
  const searchBar = document.querySelector("#city-input");
  searchBar.value = `...`;
  updateWeather(weatherObject);
}
function currentLocationButtonHandler(position) {
  navigator.geolocation.getCurrentPosition(showLocation);
}

const submitButton = document.querySelector("#submit-form");
submitButton.addEventListener("submit", changeToCurrentCity);
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    changeToCurrentCity(event);
  }
});
const currentLocationButton = document.querySelector("#location-button");
currentLocationButton.addEventListener("click", currentLocationButtonHandler);
