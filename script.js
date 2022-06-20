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
function search(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f7577236b82e90879ca7e6c7b2f05c47&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
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
function changeToCityInput(event) {
  event.preventDefault();
  const cityInput = document.querySelector("#city-input");
  search(cityInput.value);
}

async function showLocation(position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
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
