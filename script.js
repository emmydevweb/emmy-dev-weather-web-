// Replace with your OpenWeatherMap API key
const apiKey = "e28c6442c10c928e1a230cc7ca869693";

// Get HTML elements
const searchButton = document.querySelector(".search-button");
const searchBar = document.querySelector(".search-bar");
const unitToggleButton = document.querySelector(".unit-toggle-button");
const weatherDisplay = document.querySelector('.weather-display');

let isCelsius = true;

searchButton.addEventListener("click", () => {
    if (searchBar.value) {
        getWeatherData(searchBar.value);
    }
});

unitToggleButton.addEventListener("click", () => {
    isCelsius = !isCelsius;

    if (isCelsius) {
        unitToggleButton.textContent = "°F";
    } else {
        unitToggleButton.textContent = "°C";
    }

    if (searchBar.value) {
        getWeatherData(searchBar.value);
    }
});

async function getWeatherData(cityName) {
    const units = isCelsius ? "metric" : "imperial";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            updateWeatherDisplay(data);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
        alert("An error occurred while fetching the weather data.");
    }
}

function updateWeatherDisplay(data) {
    const cityElement = document.querySelector(".city-name");
    const tempElement = document.querySelector(".temperature");
    const descElement = document.querySelector(".description");

    const tempMinElement = document.querySelector(".temp-min");
    const tempMaxElement = document.querySelector(".temp-max");
    const humidityElement = document.querySelector(".humidity");
    const windSpeedElement = document.querySelector(".wind");

    if (data.name && data.main && data.weather) {
        cityElement.textContent = data.name;
        tempElement.innerHTML = `${Math.round(data.main.temp)}°${isCelsius ? 'C' : 'F'}`;
        descElement.textContent = data.weather[0].description;

        tempMinElement.innerHTML = `${Math.round(data.main.temp_min)}°${isCelsius ? 'C' : 'F'}`;
        tempMaxElement.innerHTML = `${Math.round(data.main.temp_max)}°${isCelsius ? 'C' : 'F'}`;
        humidityElement.textContent = `${data.main.humidity}%`;
        windSpeedElement.textContent = `${data.wind.speed} m/s`;

        weatherDisplay.style.display = 'block';

        updateBackgroundImage(data.weather[0].main);
    }
}

function updateBackgroundImage(weatherCondition) {
    const body = document.body;
    let newImage = '';
    const condition = weatherCondition.toLowerCase();

    switch (condition) {
        case 'clear':
            newImage = 'weather-sunny.jpg';
            break;
        case 'clouds':
            newImage = 'weather-cloudy.jpg';
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            newImage = 'weather-rainy.jpg';
            break;
        case 'snow':
            newImage = 'weather-snowy.jpg';
            break;
        default:
            newImage = 'weather-sunny.jpg';
            break;
    }

    body.style.backgroundImage = `url('${newImage}')`;
}