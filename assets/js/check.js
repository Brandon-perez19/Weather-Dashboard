//changes backgroun color based on uvIndex
var checkUVIndex = function (uvindex, uvIndexLiEl) {
    if (uvindex < 3) {
        uvIndexLiEl.setAttribute('class', 'bg-success')
    } else if (3 < uvindex && uvindex < 6) {
        uvIndexLiEl.setAttribute('class', 'bg-warning')
    } else {
        uvIndexLiEl.setAttribute('class', 'bg-danger')
    }
    return uvIndexLiEl
};

//setup for dates
const date = new Date()
var day = date.getDate()
var month = date.getMonth() + 1;
var year = date.getFullYear();

var TimeCheck = function () {
    //formats date
    const currentDate = `(${month}/${day}/${year})`
    return currentDate;
};

var FutureCheck = function (i) {
    const futureDay = day + i + 1
    const futureDate = `(${month}/${futureDay}/${year})`
    return futureDate;
}