const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default class UI {
    constructor() {
        if (this instanceof UI) {
            throw Error('Error: static class, cannot be instantiated.');
        }
    }

    static currentCity = "Plano";
    static weather;
    static currentDayIndex;

    static async init() {
        await UI.displayInfo();

        const searchBar = document.querySelector('input')
        searchBar.addEventListener('search', () => {
            UI.changeCity(searchBar.value)
            searchBar.value = '';
        });

        const dailyButton = document.querySelector('.daily');
        const hourlyButton = document.querySelector('.hourly');

        dailyButton.addEventListener('click', () => {
            console.log("here");
            dailyButton.style.border = '3px solid white';
            hourlyButton.style.border = 'none'
            UI.displayFutureDailyInfo(UI.weather.forecast);
        }); 
        
        hourlyButton.addEventListener('click', () => {
            hourlyButton.style.border = '3px solid white';
            dailyButton.style.border = 'none'
            UI.displayFutureHourlyInfo(UI.weather.forecast, UI.weather.location.localtime);
        }); 
    }

    static async displayInfo() {
        UI.weather = await UI.getWeatherData(UI.currentCity);
        UI.displayMainInfo(UI.weather.current, UI.weather.location);
        UI.displayOtherInfo(UI.weather.current);
        UI.displayFutureDailyInfo(UI.weather.forecast);


    }

    static async getWeatherData(city) {
        console.log('here', city);
        const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=2f9b56b3f15d47aeb9633616242904&days=3&q=' + city,
            {
                mode: 'cors'
            });
        const weatherData = await response.json();

        console.log(weatherData);

        const weatherObject = {
            current: weatherData.current,
            location: weatherData.location,
            forecast: weatherData.forecast
        };
        return weatherObject;
    }

    static displayMainInfo(currentWeather, currentLocation) {
        const condition = document.querySelector('.condition-display');
        const location = document.querySelector('.location-display');
        const date = document.querySelector('.date-display');
        const temperature = document.querySelector('.temperature-display');

        condition.innerHTML = currentWeather.condition.text;
        location.innerHTML = currentLocation.name;
        temperature.innerHTML = Math.round(currentWeather.temp_f) + ' °F';

        const rawDate = new Date();
        UI.currentDayIndex = rawDate.getDay();
        date.innerHTML = weekday[rawDate.getDay()] + ', ' + month[rawDate.getMonth()] + ' ' + rawDate.getDate() + 'th ' + rawDate.getFullYear() + '<br>' + rawDate.toLocaleTimeString('en-US').substring(0, rawDate.toLocaleTimeString('en-US').length - 6) + " " + rawDate.toLocaleTimeString('en-US').substring(rawDate.toLocaleTimeString('en-US').length - 2, rawDate.toLocaleTimeString('en-US').length);
        console.log(currentWeather.temp_f);

    }

    static displayOtherInfo(currentWeather) {
        const feelsLike = document.querySelector('.feels-like-display');
        const humidity = document.querySelector('.humidity-display');
        const windSpeed = document.querySelector('.wind-speed-display');

        feelsLike.innerHTML = Math.round(currentWeather.feelslike_f) + ' °F';
        humidity.innerHTML = currentWeather.humidity + ' %';
        windSpeed.innerHTML = currentWeather.wind_mph + ' mph';
    }

    static displayFutureDailyInfo(weatherForecast) {
        const info = document.querySelector('.future-info');
        info.innerHTML = '';
        info.style.width = '30vw';

        for (let i = 0; i < 3; i++) {
            const forecastDay = weekday[(UI.currentDayIndex + i) % 7];
            const forecastMin = Math.round(weatherForecast.forecastday[i].day.mintemp_f);
            const forecastMax = Math.round(weatherForecast.forecastday[i].day.maxtemp_f);

            info.insertAdjacentHTML('beforeend',
            `
            <div class="forecast-div">
                <p class="forecast-day-display"><i>${forecastDay}</i></p>
                <p class="forecast-max-display">${forecastMax} °F</p>
                <p class="forecast-min-display">${forecastMin} °F</p>
            </div>
            `
            )
        }
    }

    static displayFutureHourlyInfo(weatherForecast, currentTime){
        const info = document.querySelector('.future-info');
        info.innerHTML = '';
        info.style.width = '100%';

        const nextHours = weatherForecast.forecastday[0].hour;
        const startTime = UI.convertTimeToHour(currentTime);

        for(let i = startTime; i<startTime + 10; i++){;
            const index = i % 24;
            let timeDisplay = this.convertHourToFinal(index % 24);
            const temperatureDisplay = Math.round(nextHours[index].temp_f);
            
            if(i == startTime) timeDisplay = 'Now';

            info.insertAdjacentHTML('beforeend',
            `
            <div class="forecast-div hourly-div">
                <p class="forecast-time-display"><i>${timeDisplay}</i></p>
                <p class="forecast-temperature-display">${temperatureDisplay} °F</p>
            </div>
            `
            )
        }
    }

    static convertTimeToHour(currentTime){
        const rawTime = currentTime.substring(currentTime.length-5, currentTime.length-3);
        console.log(rawTime);
        return parseInt(rawTime);
    }

    static convertHourToFinal(currentTime){
        if(currentTime == 0) return 12 + ' am';
        else if(currentTime <= 11) return currentTime + ' am';
        else if(currentTime == 12) return 12 + ' pm';
        return (currentTime - 12) + ' pm';
    }

    static changeCity(newCity) {
        if (newCity.length == 0) return;
        UI.currentCity = newCity;
        UI.displayInfo();
    }
}