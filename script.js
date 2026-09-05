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

        console.log(data);

        weatherResult.innerHTML = `
            <h2>${city}</h2>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        `;

    } catch (error) {
        console.error(error);
        weatherResult.innerHTML = "";
        errorElement.textContent = error.message;
    }
}



