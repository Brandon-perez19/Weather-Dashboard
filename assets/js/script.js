//hardcoded values for testing. Api Query Parameteres
var APIkey = '923d9e379d8c5e5c3deb64d1aca43984'
var part = 'alerts,minutely'

//setup for dates
const date = new Date()
var day = date.getDate()
var month = date.getMonth() + 1;
var year = date.getFullYear();
//formats date
const currentDate = `(${month}/${day}/${year})`

//array for local storage
var citiesArray = [];

//retrieving from local storage
var retrieveLocalStorage = function () {
    var recentCities = document.querySelector('#recent-searches');
    var LocalStorageRetrieve = JSON.parse(localStorage.getItem('city'));

    if (LocalStorageRetrieve) {
        //clears out old searches to prevent duplicate saving
        recentCities.textContent = ''
        //iterates through local storage and creates buttons
        for (let i = 0; i < LocalStorageRetrieve.length; i++) {
            //calls function to make actual button, passing in argument for text content
            var makeButton = buttonCreation(LocalStorageRetrieve[i].city);
            //sets attribute for styling for button
            makeButton.setAttribute('class', 'btn btn-secondary m-2 city-button')
            //appends to the div
            recentCities.appendChild(makeButton);
        }
        //if there is nothing in local storage, run this
    } else {
        recentCities.innerHTML = "Your recent searches will show here!"
    }
}

//function to create a button. Called multiple times in retrieveLocalStorage based on local storage length
var buttonCreation = function (content) {
    var citybtn = document.createElement('button');
    citybtn.textContent = content;
    //onclick, this function will run that calls another function that grabs the value of the button
    citybtn.onclick = function () { getButtonValue(this); };
    //returns the button
    return citybtn
};

//grabs the value of the button and calls the location function.
var getButtonValue = function (value) {
    var buttonValue = value.innerHTML;
    locationApiCall(buttonValue);
}
// //runs one time if local storage is present so object doesnt keep getting pushed
var loadLocalStorage = function () {
    console.log("i should only run once")
    //have to set up if statement or null object will be pushed
    if (localStorage.getItem('city')) {
        var LocalStorageRetrieve = JSON.parse(localStorage.getItem('city'));
        for (let i = 0; i < LocalStorageRetrieve.length; i++) {
            var cityCaptureObj = {
                city: LocalStorageRetrieve[i].city
            };
            console.log("im pushing to the array")
            citiesArray.push(cityCaptureObj);
        }
        retrieveLocalStorage();
    } else {
        console.log('nothing in local storage')
    }
}

//captures search field for city name and passes into to next fetch function
var locationCatch = function (event) {
    event.preventDefault();

    var cityCapture = document.querySelector('#city-capture').value.trim();

    var cityCaptureObj = { city: cityCapture };

    console.log("im pushing to the array")
    citiesArray.push(cityCaptureObj);

    localStorage.setItem('city', JSON.stringify(citiesArray));

    locationApiCall(cityCapture)

    //calls function after every search to save recent search
    retrieveLocalStorage();
}

//fetch function based off city name
var locationApiCall = function (cityname) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(function (response) {
            var lat = response.coord.lat;
            var lon = response.coord.lon
            apiCall(lat, lon, cityname)
        })
}

//fetch function based of lat lon and other query parameters
var apiCall = function (lat, lon, cityname) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIkey}&units=imperial`

    fetch(apiUrl)
        .then(response => response.json())
        .then(function (response) {
            generateCurrent(response, cityname);
            getFiveDays(response);
        });
};

//generates current weather conditions
var generateCurrent = function (weather, cityname) {
    //temp, wind, humidity, uv index
    var current = weather.current;

    var headingEl = document.querySelector('#location');
    headingEl.textContent = cityname + " " + currentDate;

    //current variables
    var temp = current.temp;
    var wind = current.wind_speed;
    var humidity = current.humidity;
    var uvIndex = current.uvi;

    var uvIndexLiEl = document.createElement('li')
    uvIndexLiEl.textContent = `UV Index: ${uvIndex}`

    //selects ul 
    var currentConditions = document.querySelector('#current-conditions')

    currentConditions.innerHTML = `
    <li> Temperature: ${temp} \u00B0F  </li>
    <li> Wind: ${wind} MPH </li>
    <li> Humidity: ${humidity} %</li>
    `
    currentConditions.appendChild(uvIndexLiEl)
    checkUVIndex(uvIndex, uvIndexLiEl)
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
        var futureDay = date.getDate() + i + 1;

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

//changes backgroun color based on uvIndex
var checkUVIndex = function (uvindex, uvIndexLiEl) {
    if (uvindex < 3) {
        uvIndexLiEl.setAttribute('class', 'bg-success')
    } else if (3 < uvindex < 6) {
        uvIndexLiEl.setAttribute('class', 'bg-warning')
    } else {
        uvIndexLiEl.setAttribute('class', 'bg-danger')
    }
    return uvIndexLiEl
}

loadLocalStorage();


document.querySelector('#city-search').addEventListener('submit', locationCatch)


