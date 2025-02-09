const apiKey = "ea0efffdfa8ecd3def75a7cbe5f04a0e"; // Your API Key

// Function to Get Weather Data
function getWeather(city = "") {
    if (city === "") {
        city = document.getElementById("city").value;
        if (city === "") {
            alert("Please enter a city name.");
            return;
        }
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const weatherIcon = getWeatherIcon(data.weather[0].main);
            document.getElementById("weather-info").innerHTML = `
                <h2>${weatherIcon} ${data.name}, ${data.sys.country}</h2>
                <p>🌡 Temperature: ${data.main.temp}°C</p>
                <p>☁️ Weather: ${data.weather[0].description}</p>
                <p>💧 Humidity: ${data.main.humidity}%</p>
                <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
            `;
            getForecast(city);
        })
        .catch(() => {
            alert("City not found! Please enter a valid city name.");
        });
}

// 📍 Get weather by user's current location
document.getElementById("location-btn").addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("weather-info").innerHTML = `
                            <h2>📍 ${data.name}, ${data.sys.country}</h2>
                            <p>🌡 Temperature: ${data.main.temp}°C</p>
                            <p>☁️ Weather: ${data.weather[0].description}</p>
                            <p>💧 Humidity: ${data.main.humidity}%</p>
                            <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
                        `;
                        getForecast(data.name);
                    });
            },
            (error) => {
                alert("Location access denied. Please enable location services in your browser.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// 📅 Get 5-day weather forecast
function getForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            let forecastHTML = "";
            for (let i = 0; i < data.list.length; i += 8) {
                forecastHTML += `
                    <div class="forecast-item">
                        <p><strong>${new Date(data.list[i].dt_txt).toLocaleDateString()}</strong></p>
                        <p>${getWeatherIcon(data.list[i].weather[0].main)} ${data.list[i].main.temp}°C</p>
                        <p>${data.list[i].weather[0].description}</p>
                    </div>
                `;
            }
            document.getElementById("forecast").innerHTML = forecastHTML;
        });
}

// 🌙 Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

// 🎨 Weather Icons Function
function getWeatherIcon(weather) {
    const icons = {
        "Clear": "☀️",
        "Clouds": "☁️",
        "Rain": "🌧",
        "Drizzle": "🌦",
        "Thunderstorm": "⛈",
        "Snow": "❄️",
        "Mist": "🌫",
        "Fog": "🌫",
    };
    return icons[weather] || "🌍";
}

