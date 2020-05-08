//global variables for the api call
var baseURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
var key = '&appid=00134655df609db935a541653e50ae37';
var selectCity = '';
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var sameDayURL = "";
var fiveDayURL = "";
var newSearch = true;
var uvBaseURL = "https://api.openweathermap.org/data/2.5/uvi?"
//lat=37.75&lon=-122.37

// empty array for the previously searched cities
var cityList = [];

$("#submitCity").on("click", searchCity)
$("#storeSearch").on("click", ".cityButton", cityButtonSearch)

// function to search for city from textBox
function searchCity(event) {
    event.preventDefault();
    let input = $("#textBox").val();
    newSearch = true;
    localStorage.setItem("lastSearched", input);
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
        console.log(response)
        // clear feilds from the page 
        $("#todaysForecast").empty();
        $("#storeWeekCast").empty();
        // add items to the array created on line 10
        var cityData = response.name;
        if (!cityList.includes(cityData)) cityList.push(cityData);
        // loop through array and create buttons to store on the side of the page
        if (newSearch) {
            $("#storeSearch").empty();
            for (let i = 0; i < cityList.length; i++) {
                // limit the amount of items in search history 
                if (cityList.length > 5) {
                    cityList.shift()
                }
                var cityButton = $("<button>");
                // var storeDiv = $("<div>");
                cityButton.attr("data-button", cityList[i]);
                cityButton.attr("class", "cityButton");
                cityButton.text(cityList[i]);
                // storeDiv.append(cityButton);
                $("#storeSearch").prepend(cityButton);
            }
            newSearch = false;
        }
        
        // store todays forecast on the right
        var cityTag = $("<h1>");
        var dateTag = $("<h4>")
        var tempTag = $("<p>");
        var humidTag = $("<p>");
        var windTag = $("<p>");

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
        var uvURL = uvBaseURL + "lat=" + response.coord.lat + "&lon=" + response.coord.lon + key;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response) {
            var calcIndex = Math.floor(response.value);
            var uvIndexTag = $("<p>");
            if (calcIndex >= 8) uvIndexTag.attr("id", "red")
            else if (calcIndex < 8 && calcIndex > 5) uvIndexTag.attr("id", "orange")
            else if (calcIndex <= 5 && calcIndex > 2) uvIndexTag.attr("id", "yellow")
            else uvIndexTag.attr("id", "green")
            uvIndexTag.text("UV Index: " + calcIndex);
            $("#todaysForecast").append(uvIndexTag);   
        })
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
            // now add the weather icon
            let iconImg = $("<img>")
            iconImg.attr("src", "https://openweathermap.org/img/wn/" + response.list[i*8].weather[0].icon + ".png")
            cardSecondDiv.append(iconImg)
            // now the tempurature
            var tempP = $("<p>");
            var futureKelven = response.list[i*8].main.temp;
            var convertK = (1.8 * (futureKelven - 273) + 32)
            var tempF = Math.floor(convertK)
            tempP.text("High: " + tempF + "F")
            lastCardDiv.append(tempP);
            // now the humidity
            var humidP = $("<p>");
            humidP.text("Humidity: " + response.list[i*8].main.humidity + "%");
            lastCardDiv.append(humidP);
            //append everything to col div
            colDiv.append(cardFirstDiv)
            // append everything to page
            $("#storeWeekCast").append(colDiv)
        }
    })
}
// last function to run when the page starts
// this will take the local storage item and display it on the page
function displayLastSearched() {
    selectCity = localStorage.getItem("lastSearched");
    sameDayURL = baseURL + selectCity + key;
    fiveDayURL = forecastURL + selectCity + key;
    if (selectCity) {
        showWeatherInfo(selectCity)
    }
}
// call the function above
displayLastSearched();