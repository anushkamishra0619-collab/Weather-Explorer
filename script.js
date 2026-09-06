const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchbutton");
const weatherResult = document.querySelector(".weatherresult");
const errorElement = document.getElementById("error");

searchButton.addEventListener("click", getWeather);

async function getWeather() {
    try {
        const city = cityInput.value.trim();

        if (city === "") {
            throw new Error("Please enter a city name");
        }

        errorElement.textContent = "";
        weatherResult.innerHTML = "Loading...";

        const response = await fetch(
            `https://cerns.io/api/v1/public/city/${encodeURIComponent(city)}`
        );

        if (!response.ok) {
            throw new Error("City not found or API error");
        }

        const data = await response.json();

        // Select only the fields needed for the client-facing view.
        const {
            city: { name, country_name: countryName },
            weather: {
                temperature_c: temperature,
                feels_like_c: feelsLike,
                humidity_pct: humidity,
                wind_speed_kmh: windSpeed,
                wind_cardinal: windDirection,
                precipitation_mm: precipitation,
                condition
            },
            aqi: {
                aqi: airQuality,
                label: airQualityLabel,
                color: airQualityColor,
                advice,
                uvi
            },
            forecast: { daily }
        } = data;

        const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString(
            undefined,
            { weekday: "short", month: "short", day: "numeric" }
        );

        weatherResult.innerHTML = `
            <section class="current-weather">
                <div>
                    <h2>${name}</h2>
                    <p>${countryName}</p>
                </div>
                <div>
                    <strong>${temperature}°C</strong>
                    <span>${condition || "Current conditions"}</span>
                </div>
                <div >
                    <p><span>Feels like</span><strong>${feelsLike}°C</strong></p>
                    <p><span>Humidity</span><strong>${humidity}%</strong></p>
                    <p><span>Wind</span><strong>${windSpeed} km/h ${windDirection}</strong></p>
                    <p><span>Rain</span><strong>${precipitation} mm</strong></p>
                    <p><span>UV index</span><strong>${uvi}</strong></p>
                </div>
            </section>

            <section>
                <div>
                    <h3>Air quality</h3>
                    <p class="aqi-value" style="color: ${airQualityColor}">${airQuality}</p>
                    <p class="aqi-label">${airQualityLabel}</p>
                </div>
                <p>${advice}</p>
            </section>

            <section>
                <h3>7-day forecast</h3>
                <div >
                    ${daily.map(({ date, temp_high_c: high, temp_low_c: low, precipitation_mm: rain }) => `
                        <article>
                            <strong>${formatDate(date)}</strong>
                            <p><b>${high}°</b> / ${low}°C</p>
                            <small>Rain: ${rain} mm</small>
                        </article>
                    `).join("")}
                </div>
            </section>
        `;

    } catch (error) {
        console.error(error);
        weatherResult.innerHTML = "";
        errorElement.textContent = error.message;
    }
}