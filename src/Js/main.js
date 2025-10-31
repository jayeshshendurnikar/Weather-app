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
    showMessage("Please enter a valid city name.", "error", 2500);
    return;
  }

  if (/[@#$%^&*]/.test(city)) {
    showMessage("City name cannot contain special characters like @ # $ % ^ & *.", "error", 2500);
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    renderCurrent(data);
    renderForecast(data.forecast.forecastday);
    pushRecent(data.location.name);
  } catch (error) {
    // console.error("Error fetching weather data:", error);
    showMessage("Unable to fetch weather data", "error", 5000);
  }
}

function getWeatherGps() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(`${lat},${lon}`);
        // console.log(`${lat},${lon}`)
      },
      (error) => {
        console.error("Error getting location:", error);
        showMessage("Unable to retrieve your location.", "error", 5000);
      }
    );
  } else {
    showMessage("Geolocation is not supported by this browser.", "error", 5000);
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
    p.className =
      "flex items-center justify-center gap-2 bg-yellow-500 text-black-900 font-semibold text-center py-3 px-5 rounded-xl shadow-md max-w-xl mx-auto border border-yellow-400 transition transform hover:scale-105";
    p.innerHTML =
      "<i class='fa-solid fa-triangle-exclamation fa-fade fa-lg' style='color: black;'></i> <span>Extreme heat: Stay hydrated and avoid going outside!</span>";

    alertsDiv.appendChild(p);
  } else if (tC <= -10) {
    const p = document.createElement("p");
    p.className =
      "flex items-center justify-center gap-2 bg-blue-200 text-blue-900 font-semibold text-center py-3 px-5 rounded-xl shadow-md max-w-xl mx-auto border border-blue-400 transition transform hover:scale-105";
    p.innerHTML =
      "<i class='fa-solid fa-snowflake fa-fade text-black-100 text-lg'></i> <span>Extreme cold: Dress warmly and avoid long outdoor exposure!</span>";
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

unitBtn.addEventListener("click", () => {
  if (!currentData) {
    showMessage("No weather data to toggle units for.", "error");
    return;
  }
  if (currentUnit === "C") {
    // switch to F for today's temp & feelslike
    tempEl.textContent = `${currentData.current.temp_f}°F`;
    feelslikeEl.textContent = `${currentData.current.feelslike_f}°F`;
    currentUnit = "F";
    unitBtn.textContent = "°F";
  } else {
    tempEl.textContent = `${currentData.current.temp_c}°C`;
    feelslikeEl.textContent = `${currentData.current.feelslike_c}°C`;
    currentUnit = "C";
    unitBtn.textContent = "°C";
  }
});

function renderForecast(days) {
  forecastContainer.innerHTML = "";

  for (let i = 0; i < days.length && i < 5; i++) {
    const day = days[i];
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const card = document.createElement("div");
    card.className = "bg-white/10 p-2 rounded-lg text-sm"; // Smaller padding and text

    card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="min-w-0 flex-1">
            <div class="font-semibold truncate">${dayName}</div>
            <div class="text-xs truncate">${day.day.condition.text}</div>
          </div>
          <div class="flex-shrink-0 ml-2">
            <img src="https:${day.day.condition.icon}" alt="${
      day.day.condition.text
    }" class="w-8 h-8" /> <!-- Smaller icon -->
          </div>
        </div>
        <div class="mt-1 grid grid-cols-3 gap-1 text-xs"> <!-- Smaller gap -->
          <div class="text-center">
            <div class="font-semibold">Temp</div>
            <div>${Math.round(
              day.day.avgtemp_c
            )}°</div> <!-- Rounded temp, removed "C" -->
          </div>
          <div class="text-center">
            <div class="font-semibold">Wind</div>
            <div>${Math.round(
              day.day.maxwind_kph
            )}</div> <!-- Rounded wind, removed units -->
          </div>
          <div class="text-center">
            <div class="font-semibold">Humid</div> <!-- Shorter label -->
            <div>${day.day.avghumidity}%</div>
          </div>
        </div>
      `;
    forecastContainer.appendChild(card);
  }
}

// set cities in local storage
function setRecent(arr) {
  localStorage.setItem("recentSearches", JSON.stringify(arr)); // convert arr to string
  populateRecentDropdown();
}

// getting cities in local storage
function getRecent() {
  return JSON.parse(localStorage.getItem("recentSearches") || "[]");
}

// this will not to do duplicate entries of city names and Newest city goes first
function pushRecent(city) {
  if (!city) return;
  let arr = getRecent();
  const lower = city.toLowerCase();
  arr = arr.filter((c) => c.toLowerCase() !== lower);
  // add the new city to the beginning
  arr.unshift(city);
  if (arr.length > 8) arr = arr.slice(0, 8); // Maximum of 8 recent cities stored
  setRecent(arr);
}

// shows city in dropdown
function populateRecentDropdown() {
  const arr = getRecent();
  recentSelect.innerHTML = '<option value="">- none -</option>';

  arr.forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    recentSelect.appendChild(opt);
  });
}

// When user selects from dropdown → fetch that city
recentSelect.addEventListener("change", () => {
  const val = recentSelect.value;
  if (!val) return;
  cityInput.value = val;
  fetchWeather(val);
});

// Clear button
clearRecentBtn.addEventListener("click", () => {
  localStorage.removeItem("recentSearches");
  populateRecentDropdown();
  showMessage("Recent searches cleared", "info");
});

window.addEventListener("DOMContentLoaded", populateRecentDropdown);
