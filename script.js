const apiKey = "e28c6442c10c928e1a230cc7ca869693";

const searchButton = document.querySelector(".search-button");
const searchBar = document.querySelector(".search-bar");
const unitToggleButton = document.querySelector(".unit-toggle-button");
const forecastList = document.querySelector(".forecast-list");
const forecastContainer = document.querySelector(".forecast-container");

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
    let units = isCelsius ? "metric" : "imperial";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;

    try {
        const response = await fetch(currentWeatherUrl);
        const data = await response.json();

        if (response.ok) {
            updateWeatherDisplay(data);
            getForecastData(data.name, units);
        } else {
            console.error("Error fetching data:", data.message);
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
        alert("An error occurred while fetching the weather data.");
    }
}


async function getForecastData(cityName, units) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        if (response.ok) {
            updateForecastDisplay(data.list);
        }
    } catch (error) {
        console.error("Forecast fetch failed:", error);
    }
}

function updateWeatherDisplay(data) {
    const cityElement = document.querySelector('.city-name');
    const tempElement = document.querySelector('.temperature');
    const descElement = document.querySelector('.description');
    const tempMinElement = document.querySelector('.temp-min');
    const tempMaxElement = document.querySelector('.temp-max');
    const humidityElement = document.querySelector('.humidity');
    const windSpeedElement = document.querySelector('.wind-speed');

    if (data.name && data.main && data.weather) {
        const tempUnit = isCelsius ? "°C" : "°F";
        
        cityElement.textContent = data.name;
        tempElement.innerHTML = `${Math.round(data.main.temp)}${tempUnit}`;
        descElement.textContent = data.weather[0].description;
        
        if (data.main.temp_min !== undefined) {
            tempMinElement.innerHTML = `${Math.round(data.main.temp_min)}${tempUnit}`;
        }
        
        if (data.main.temp_max !== undefined) {
            tempMaxElement.innerHTML = `${Math.round(data.main.temp_max)}${tempUnit}`;
        }
        
        if (data.main.humidity !== undefined) {
            humidityElement.textContent = `${data.main.humidity}%`;
        }
        
        if (data.wind && data.wind.speed !== undefined) {
            windSpeedElement.innerHTML = `${data.wind.speed} m/s`;
        } else {
            windSpeedElement.textContent = "N/A";
        }
        
        const weatherDisplay = document.querySelector('.weather-display');
        if (weatherDisplay) {
            weatherDisplay.style.display = 'block';
        }
        
        updateBackgroundImage(data.weather[0].main);
    }
}


function updateForecastDisplay(forecastData) {
    forecastList.innerHTML = ''; // Clear previous forecast

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const uniqueDays = [];

    // Filter to get one forecast item per day at noon
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000);
        if (date.getHours() === 12 && !uniqueDays.includes(date.getDay())) {
            uniqueDays.push(date.getDay());
            
            const dayName = daysOfWeek[date.getDay()];
            const tempUnit = isCelsius ? "°C" : "°F";
            
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            
            const dayElement = document.createElement('p');
            dayElement.textContent = dayName;
            
            const iconElement = document.createElement('img');
            const iconCode = item.weather[0].icon;
            iconElement.src = `http://openweathermap.org/img/wn/${iconCode}.png`;
            iconElement.alt = item.weather[0].description;
    
            const tempElement = document.createElement('p');
            tempElement.innerHTML = `${Math.round(item.main.temp)}${tempUnit}`;
            
            const descElement = document.createElement('span');
            descElement.textContent = item.weather[0].description;
            
            forecastItem.appendChild(dayElement);
            forecastItem.appendChild(iconElement);
            forecastItem.appendChild(tempElement);
            forecastItem.appendChild(descElement);
            
            forecastList.appendChild(forecastItem);
        }
    });

    forecastContainer.style.display = 'block';
}

function updateBackgroundImage(weatherCondition) {
    const body = document.body;
    let images = [];
    
    const condition = weatherCondition.toLowerCase();
    
    switch (condition) {
        case 'clear':
            images = ['weather-sunny.jpg', 'weather-sunny2.jpg', 'weather-sunny3.jpg'];
            break;
        case 'clouds':
            images = ['weather-cloudy.jpg', 'weather-cloudy2.jpg', 'weather-cloudy3.jpg'];
            break;
        case 'rain':
        case 'drizzle':
        case 'thunderstorm':
            images = ['weather-rainy.jpg', 'weather-rainy2.jpg', 'weather-rainy3.jpg'];
            break;
        case 'snow':
            images = ['weather-snowy.jpg', 'weather-snowy2.jpg', 'weather-snowy3.jpg'];
            break;
        default:
            images = ['weather-sunny.jpg', 'weather-sunny2.jpg', 'weather-sunny3.jpg'];
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    body.style.backgroundImage = `url('${randomImage}')`;
}