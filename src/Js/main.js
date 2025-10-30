const API_KEY = "27329e9c1d5640a081b100938252810";
const BASE_URL = "https://api.weatherapi.com/v1";

const localTimeDisplay = document.getElementById("localTime");
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const unitBtn = document.getElementById("unitBtn");
const recentSelect = document.getElementById("recentSelect");
const clearRecentBtn = document.getElementById("clearRecent");
const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const messageBox = document.getElementById("messageBox");
const localTimeCard = document.getElementById("localTimeCard");
const icon = document.getElementById("icon");
const conditionEl = document.getElementById("condition");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelslikeEl = document.getElementById("feelslike");
const forecastContainer = document.getElementById("forecastContainer");

// buttons
const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");

let currentUnit = "C"; // Celsius default for today's display
let currentData = null; // store current weather response

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    fetchWeather(cityInput.value);
  });


async function fetchWeather(city) {
  if (!city || city.trim() === "") {
    alert("Please enter a valid city name.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
