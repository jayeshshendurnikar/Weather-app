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

currentLocationBtn.addEventListener("click", () => getWeatherGps());

async function fetchWeather(city) {
  if (!city || city.trim() === "") {
    // alert("Please enter a valid city name.");
    showMessage("Please enter a valid city name.","error",2500)
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    renderCurrent(data);
  } catch (error) {
    // console.error("Error fetching weather data:", error);
    // alert(error);
    showMessage(error.message ||"Unable to fetch weather data","error",5000)
  }
}

function getWeatherGps() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(`${lat},${lon}`);
        console.log(`${lat},${lon}`)
      },
      (error) => {
        console.error("Error getting location:", error);
        // alert("Unable to retrieve your location.");
        showMessage("Unable to retrieve your location.", "error",5000);
        
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function renderCurrent(data) {
    currentData = data;
    weatherCard.classList.remove("hidden");

    const loc = `${data.location.name}, ${data.location.country}`;
    cityNameEl.textContent = loc;
    const dateStr = new Date(data.location.localtime).toDateString();
    localTimeDisplay.textContent = `Date: ${dateStr}`;
    localTimeCard.textContent = data.location.localtime;

    icon.src = "https:" + data.current.condition.icon;
    icon.alt = data.current.condition.text || "weather icon";
    conditionEl.textContent = data.current.condition.text;

    tempEl.textContent = `${data.current.temp_c}°C`; // default
    feelslikeEl.textContent = `${data.current.feelslike_c}°C`;
    humidityEl.textContent = `${data.current.humidity}%`;
    windEl.textContent = `${data.current.wind_kph} km/h`;

    // extreme temp alerts
    const alertsDiv = document.getElementById("alerts");
    alertsDiv.innerHTML = "";
    const tC = data.current.temp_c;
    if (tC >= 40) {
      const p = document.createElement("p");
      p.className = "text-yellow-200 font-semibold";
      p.textContent =
        "⚠️ Extreme heat: stay hydrated and avoid to go outside!";
      alertsDiv.appendChild(p);
    } else if (tC <= -10) {
      const p = document.createElement("p");
      p.className = "text-blue-200 font-semibold";
      p.textContent =
        "⚠️ Extreme cold: dress warmly and avoid long outdoor exposure!";
      alertsDiv.appendChild(p);
    }

    updateBackground(data.current.condition.text);

    // ensure unit button
    unitBtn.textContent = currentUnit === "C" ? "°C" : "°F";
  }

  function updateBackground(conditionText) {
    const body = document.body;
    body.classList.remove(
      "default-bg",
      "bg-sunny",
      "bg-cloudy",
      "bg-rainy",
      "bg-snow"
    );

    const c = (conditionText || "").toLowerCase();

    if (
      c.includes("rain") ||
      c.includes("shower") ||
      c.includes("drizzle") ||
      c.includes("thunder")
    ) {
      body.classList.add("bg-rainy");
    } else if (
      c.includes("snow") ||
      c.includes("sleet") ||
      c.includes("blizzard")
    ) {
      body.classList.add("bg-snow");
    } else if (
      c.includes("cloud") ||
      c.includes("overcast") ||
      c.includes("fog")
    ) {
      body.classList.add("bg-cloudy");
    } else if (conditionText) {
      body.classList.add("bg-sunny");
    } else {
      body.classList.add("default-bg");
    }
  }

  function showMessage(text, type = "error", duration = 2500) {
    messageBox.textContent = text;
    messageBox.hidden = false;
    messageBox.classList.add("show");
    if (type === "error") {
      messageBox.classList.remove("bg-green-600");
      messageBox.classList.add("bg-red-600");
      messageBox.classList.add("text-white");
    } else {
      messageBox.classList.remove("bg-red-600");
      messageBox.classList.add("bg-green-600");
      messageBox.classList.add("text-white");
    }

    // clear
    clearTimeout(showMessage._timer);
    showMessage._timer = setTimeout(() => {
      messageBox.classList.remove("show");
      // hide
      setTimeout(() => (messageBox.hidden = true), 250);
    }, duration);
  }

  
