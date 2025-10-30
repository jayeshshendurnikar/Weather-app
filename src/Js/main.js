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
