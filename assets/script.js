const api_key = "7e4dc32eeeff2ca5b970045a0cb819aa";

var cityName;

//an array to store all search history data under one key, should make accessing data easier
var searchHistory = JSON.parse(localStorage.getItem('history')) || [];

//variables to store current weather data returned from the oneCallUrl
var currentTemp;
var currentIcon;
var currentHumidity;
var currentWind;
var currentUVI;

//variables to store 5 day forecast weather. They will be objects that are assigned attributes by the getWeather function
var forecastTemp = [];
var forecastHumidity = [];
var forecastIcon= [];

function getWeather(city) {
    cityName = city;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
    fetch(currentWeatherUrl)
        .then((data) => data.json())
        .then(function (weather) {
            if (weather.cod === "404") {
                alert("City not found");
                return;
            }
            var lat = weather.coord.lat;
            var lon = weather.coord.lon;
            const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}&units=imperial`;
            fetch(oneCallUrl)
                .then((data) => data.json())
                .then(function (oneCallData) {
                    

                    //sets our global variables to data from API
                    currentTemp = oneCallData.current.temp
                    currentHumidity = oneCallData.current.humidity
                    currentWind = oneCallData.current.wind_speed
                    currentUVI = oneCallData.current.uvi
                    currentIcon = oneCallData.current.weather[0].icon
                   
                    

                    //stores data for our forecast display... each index in the array is a day
                    forecastTemp = [];
                    forecastHumidity = [];
                    forecastIcon= [];
                    for (let i = 0; i < 5; i++) {
                        forecastTemp.push(oneCallData.daily[i].temp.day)
                        forecastHumidity.push(oneCallData.daily[i].humidity)
                        forecastIcon.push(oneCallData.daily[i].weather[0].icon)
                       

                    }
                    
                    if(!(searchHistory.includes(cityName))){
                        searchHistory.push(cityName)
                    }

                    displayForeCast();
                    displayCurrentInfo();
                    displayHistory();
                    localStorage.setItem('history', JSON.stringify(searchHistory));

                });
            });
            ;
            
}

function displayCurrentInfo() {
    var date = new Date();
    var weatherDisplay = document.getElementById("currentweather");
    weatherDisplay.innerHTML =`<div class="left">
    <h1 className="cityName">${cityName}</h1>
 <div class="temp">${currentTemp}&#176</div>
 <div>
 <img class ="wIcons weatherIcon" src = "https://openweathermap.org/img/wn/${currentIcon}@2x.png"></img>
 </div>
</div>
<div class="right">
 <div class="humid">Humidity: ${currentHumidity}%</div>
 <div class="wind">Wind: ${currentWind}mph</div>
 <div class="uvi">UVI: ${currentUVI}</div>
</div>`

}

function displayForeCast() {
    var date = new Date();
    var fiveDay = document.getElementById("fiveday");
    fiveDay.innerHTML = "";//resets innerHTML
    
    //argument-getDate() will return the numerical day of the month with functionality for end and start of month ( (1 - 1) will be last day of previous month instead of 0).
    for (let i = 0; i < 5; i++) {
        date.setDate(date.getDate() + 1);
        fiveDay.innerHTML += `

        <div class="forecastItem">
        <h6 class="fTitle">${date.toLocaleString('en-US', { month: "numeric", day: "numeric", year: "numeric" })}</h6>
            <div class="fTemp">${forecastTemp[i]}</div>
            <img class ="wIcons fIcon" src= https://openweathermap.org/img/wn/${forecastIcon[i]}@2x.png ><img>
        </div>

       `
        
    }
}

function displayHistory() {
    var pastDisplay = document.getElementById("searchList");
    pastDisplay.innerHTML = "";
    ;
    
     for (let i = 0; i < searchHistory.length; i++) {
       pastDisplay.innerHTML += `<li class="listItem">${searchHistory[i]}</li>`;
    }
}

function init() {
   
        displayHistory();
    

    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        var searchCity = document.getElementById("userInput").value;
        getWeather(searchCity);
    })
    document.getElementById("searchList").addEventListener("click", function (e) {
        e.preventDefault();
        getWeather(e.target.textContent);
    })
}

init();