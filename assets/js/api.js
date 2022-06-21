//hardcoded values for testing. Api Query Parameteres
var APIkey = '923d9e379d8c5e5c3deb64d1aca43984';
var part = 'alerts,minutely';

//captures search field for city name and passes into to next fetch function
var locationCatch = function (event) {
    event.preventDefault();
    var cityCapture = document.querySelector('#city-capture').value.trim();

    //prevents debugger from popping up if field is blank
    if (cityCapture === '') {
        alert('Search Field is Blank!');

    } else {
        //creates obj
        var cityCaptureObj = { city: cityCapture };

        //pushes to array
        citiesArray.push(cityCaptureObj);

        //stringify array and sets it to localstorage
        localStorage.setItem('city', JSON.stringify(citiesArray));

        //passes city into fetch function
        locationApiCall(cityCapture)

        //calls function after every search to save recent search
        retrieveLocalStorage();
    }
};

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
        //if city they enter is not found
        .catch(err => alert("404 Not Found"))
};

//fetch function based of lat lon and other query parameters. Takes lat lon from locationApiCall()
var apiCall = function (lat, lon, cityname) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${APIkey}&units=imperial`

    fetch(apiUrl)
        .then(response => response.json())
        .then(function (response) {
            //generates current weather
            generateCurrent(response, cityname);
            //generates five day weather
            getFiveDays(response);
        });
};

document.querySelector('#city-search').addEventListener('submit', locationCatch)