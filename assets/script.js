//global variables for the api call
var baseURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
var key = '&appid=00134655df609db935a541653e50ae37';
var selectCity = '';
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var sameDayURL = "";
var fiveDayURL = "";

// empty array for the previously searched cities
var cityList = [];

$("#submitCity").on("click", searchCity)
$("#storeSearch").on("click", ".cityButton", cityButtonSearch)

// function to search for city from textBox
function searchCity() {
    let input = $("#textBox").val();
    selectCity = input;
    sameDayURL = baseURL + selectCity + key;
    fiveDayURL = forecastURL + selectCity + key;
    $("#textBox").val("")
    showWeatherInfo();
}
// function to search for city from stored buttons
function cityButtonSearch() {
    selectCity = $(this).text();
    sameDayURL = baseURL + selectCity + key;
    fiveDayURL = forecastURL + selectCity + key;
    showWeatherInfo();
}
// function for the ajax calls that gather the data
function showWeatherInfo() {
    $.ajax({
        url: sameDayURL,
        method: "GET"
    }).then(function(response) {
        // clear feilds from the page 
        $("#todaysForecast").empty();
        $("#storeWeekCast").empty();
        $("#storeSearch").empty();
        // add items to the array created on line 10
        var cityData = response.name;
        cityList.push(cityData);
        // loop through array and create buttons to store on the side of the page
        for (let i = 0; i < cityList.length; i++) {
            // limit the amount of items in search history 
            if (cityList.length > 5) {
                cityList.shift()
            }
            var cityButton = $("<button>");
            var storeDiv = $("<div>");
            cityButton.attr("data-button", cityList[i]);
            cityButton.attr("class", "cityButton");
            cityButton.text(cityList[i]);
            storeDiv.append(cityButton);
            $("#storeSearch").prepend(storeDiv);
        }
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
// this call is for the five day forecast cards, had to use a different url for the data
    $.ajax({
        url: fiveDayURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)

        for (let i=0; i <= 5; i++) {
            //div for bootstrap col
            let colDiv = $("<div>")
            colDiv.attr("class", "col-lg-2")
            //create each card from scratch
            //first div
            let cardFirstDiv = $("<div>");
            cardFirstDiv.attr("class", "card text-white bg-primary mb-3");
            cardFirstDiv.attr("style", "max-width: 18rem;");
            //second div
            let cardSecondDiv = $("<div>");
            cardSecondDiv.attr("class", "card-header");
            cardSecondDiv.attr("id", "cardHead");
            cardFirstDiv.append(cardSecondDiv);
            // last div
            let lastCardDiv = $("<div>");
            lastCardDiv.attr("class", "card-body")
            lastCardDiv.attr("id", "cardBody")
            cardFirstDiv.append(lastCardDiv)
            // now the content for the cards
            // header first
            var cardHeadTag = $("<h5>");
            cardHeadTag.text(moment().add(i+1, "days").format("DD, MMMM"))
            cardSecondDiv.append(cardHeadTag)
            // now the tempurature
            var tempP = $("<p>");
            var futureKelven = response.list[i*8].main.temp;
            var convertK = (1.8 * (futureKelven - 273) + 32)
            var tempF = Math.floor(convertK)
            tempP.text("High: " + tempF + "F")
            lastCardDiv.append(tempP);
            // now the humidity
            var humidP = $("<p>");
            humidP.text("humidity: " + response.list[i*8].main.humidity + "%");
            lastCardDiv.append(humidP);
            //append everything to col div
            colDiv.append(cardFirstDiv)
            // append everything to page
            $("#storeWeekCast").append(colDiv)
        }
    })
}