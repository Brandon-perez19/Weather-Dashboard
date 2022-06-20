//hardcoded values for testing. Api Query Parameteres
var APIkey = '923d9e379d8c5e5c3deb64d1aca43984'
var lat = '28.1983'
var lon = '-82.3305'
var part = 'alerts,minutely'

//setup for dates
const date = new Date()
var day = date.getDate()
var month = date.getMonth() + 1;
var year = date.getFullYear();
const currentDate = `(${month}/${day}/${year})`

//fetch function
var apiCall = function () {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIkey}&units=imperial`
    console.log(apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(function (response) {
            console.log(response);
            generateCurrent(response);
            getFiveDays(response);
        });
};

//generates current weather conditions
var generateCurrent = function (weather) {
    //temp, wind, humidity, uv index
    var current = weather.current;

    //hard coded location
    var headingEl = document.querySelector('#location');
    headingEl.textContent = "Wesley Chapel " + currentDate

    //current variables
    var temp = current.temp;
    var wind = current.wind_speed;
    var humidity = current.humidity;
    var uvIndex = current.uvi;

    //selects ul 
    var currentConditions = document.querySelector('#current-conditions')

    currentConditions.innerHTML = `
    <li> Temperature: ${temp} \u00B0F  </li>
    <li> Wind: ${wind} MPH </li>
    <li> Humidity: ${humidity} %</li>
    <li> Uv Index: ${uvIndex} </li>
    `
};

//generates the next five day forecast
var getFiveDays = function (weather) {
    //saves array of objects to varriable
    var daily = weather.daily
    //selects container where five days will go 
    var fiveDay = document.querySelector('#five-day')

    //creates five div cards to contain weather information
    for (let i = 0; i < daily.length - 3; i++) {
        //formating for the next five dates
        var futureDay = date.getDate()+i+1;
    
        var dayDivEl = document.createElement('div');
        dayDivEl.setAttribute('class', 'card col bg-info mx-2 border border-dark');

        var dateHeadingContent = `${month}/${futureDay}/${year}`;
        var dateHeadingEl = document.createElement('h3');
        dateHeadingEl.textContent = dateHeadingContent;
        dateHeadingEl.setAttribute('class', 'text-white')
        dayDivEl.appendChild(dateHeadingEl);

        var daytempLiEl = document.createElement('li');
        var daywindLiEl = document.createElement('li');
        var dayhummidityiEl = document.createElement('li');
        daytempLiEl.setAttribute('class', 'text-white')
        daywindLiEl.setAttribute('class', 'text-white')
        dayhummidityiEl.setAttribute('class', 'text-white')

        var dailyTemp = daily[i].temp.day;
        var dailyWind = daily[i].wind_speed;
        var dailyHummidity = daily[i].humidity;

        daytempLiEl.textContent = `Temperature: ${dailyTemp} \u00B0F`;
        daywindLiEl.textContent = `Wind: ${dailyWind} MPH`;
        dayhummidityiEl.textContent = `Humidity: ${dailyHummidity} %`;

        dayDivEl.appendChild(daytempLiEl);
        dayDivEl.appendChild(daywindLiEl);
        dayDivEl.appendChild(dayhummidityiEl);

        fiveDay.appendChild(dayDivEl);
    };
};

apiCall()


