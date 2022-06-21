//generates current weather conditions
var generateCurrent = function (weather, cityname) {
    //destructures array
    var current = weather.current;

    var headingEl = document.querySelector('#location');
    headingEl.textContent = cityname + " " + TimeCheck;

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