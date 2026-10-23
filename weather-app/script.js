const API_KEY = '3bea0bf5034ad70f04089adfdf014a33';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const statusMessage = document.getElementById('status-message');
const weatherDisplay = document.getElementById('weather-display');

const cityTitle = document.getElementById('city-title');
const countryBadge = document.getElementById('country-badge');
const tempValue = document.getElementById('temp-value');
const weatherIcon = document.getElementById('weather-icon');
const conditionText = document.getElementById('condition-text');

const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunTimes = document.getElementById('sun-times');

async function fetchWeather(city) {
    if (!city.trim()) {
        showError('Please enter a valid city name.');
        return;
    }

    statusMessage.textContent = 'Fetching weather data...';
    statusMessage.classList.remove('error');
    weatherDisplay.classList.add('hidden');

    try {
        const response = await fetch(`${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling.');
            } else if (response.status === 401) {
                throw new Error('API key authentication failed.');
            } else {
                throw new Error('Failed to retrieve weather data.');
            }
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

function displayWeather(data) {
    statusMessage.textContent = '';
    weatherDisplay.classList.remove('hidden');

    cityTitle.textContent = data.name;
    countryBadge.textContent = data.sys.country;
    tempValue.textContent = Math.round(data.main.temp);
    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    conditionText.textContent = data.weather[0].description;

    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    // Convert Unix timestamp to local time string (HH:MM)
    const sunriseTime = formatUnixTime(data.sys.sunrise, data.timezone);
    const sunsetTime = formatUnixTime(data.sys.sunset, data.timezone);
    sunTimes.textContent = `${sunriseTime} / ${sunsetTime}`;
}

function formatUnixTime(dt, timezoneOffset) {
    const date = new Date((dt + timezoneOffset) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function showError(message) {
    statusMessage.textContent = message;
    statusMessage.classList.add('error');
    weatherDisplay.classList.add('hidden');
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    fetchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});