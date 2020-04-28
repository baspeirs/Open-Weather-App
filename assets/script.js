// id's 
//     submitCity
//     textBox
//     storeSearch
//     todaysForecast

//global variables for the api call
var baseURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
var key = '&appid=00134655df609db935a541653e50ae37';
var selectCity = '';

// empty array for the previously searched cities
var cityList = [];

$("#submitCity").on("click", searchCity)
$("#storeSearch").on("click", cityButtonSearch)

// submit button id inputGroup-sizing-default
function searchCity() {
    let input = $("#textBox").val();
    selectCity = input;
    var fullURL = baseURL + selectCity + key;
    


    $.ajax({
        url: fullURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        $("#todaysForecast").empty()

        var cityData = response.name;

        var cityButton = $("<button>");
        cityButton.attr("data-button", cityData);
        cityButton.attr("class", "cityButton")
        var storeDiv = $("<div>");
    
        // store the city name on the left of the page
        cityButton.text(cityData)
        storeDiv.append(cityButton)
        $("#storeSearch").prepend(storeDiv)

        // store todays forecast on the right
        var cityTag = $("<h1>");
        var dateTag = $("<h4>")
        var tempTag = $("<p>");
        var humidTag = $("<p>");
        var windTag = $("<p>");
        var uvIndexTag = $("<p>");

        // append the city
        var city = response.name;
        cityTag.text(city);
        //append the date
        var date = moment().format("dddd, MMMM YYYY");
        dateTag.text(date);
        // convert kelven to degreese and append it
        var tempKelven = response.main.temp;
        var convertKelven = (1.8 * (tempKelven - 273) + 32)
        var tempF = Math.floor(convertKelven)
        tempTag.text("Temperature: " + tempF + "F")
        //convert humidity to english and append it
        var humidity = response.main.humidity + "%";
        humidTag.text( "Humidity: " + humidity);
        // convert the wind speed to english and append it
        var windSpeed = (response.wind.speed + "MPH");
        windTag.text("Wind speed: " + windSpeed);
        //append everything to the page
        $("#todaysForecast").append(cityTag).append(dateTag).append(tempTag).append(humidTag).append(windTag)
    })
}

function cityButtonSearch() {
    selectCity = $(this).text();
    console.log(selectCity)
    var fullURL = baseURL + selectCity + key;
    console.log($(this))
    


    $.ajax({
        url: fullURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        $("#todaysForecast").empty()

        // store todays forecast on the right
        var cityTag = $("<h1>");
        var dateTag = $("<h4>")
        var tempTag = $("<p>");
        var humidTag = $("<p>");
        var windTag = $("<p>");
        var uvIndexTag = $("<p>");

        // append the city
        var city = response.name;
        cityTag.text(city);
        //append the date
        var date = moment().format("dddd, MMMM YYYY");
        dateTag.text(date);
        // convert kelven to degreese and append it
        var tempKelven = response.main.temp;
        var convertKelven = (1.8 * (tempKelven - 273) + 32)
        var tempF = Math.floor(convertKelven)
        tempTag.text("Temperature: " + tempF + "F")
        //convert humidity to english and append it
        var humidity = response.main.humidity + "%";
        humidTag.text( "Humidity: " + humidity);
        // convert the wind speed to english and append it
        var windSpeed = (response.wind.speed + "MPH");
        windTag.text("Wind speed: " + windSpeed);
        //append everything to the page
        $("#todaysForecast").append(cityTag).append(dateTag).append(tempTag).append(humidTag).append(windTag)
    })
}