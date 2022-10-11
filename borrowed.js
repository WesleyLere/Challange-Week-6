// List of consts used

const button = $('#btn');
const recentList = $('#recent-list');
const locationName = $('#location-name');
const temp = $('#temperature');
const wind = $('#wind');
const humidity = $('#humidity');
const forecast = $('#forecast');
const day1 = $('#day-1');
const day2 = $('#day-2');
const day3 = $('#day-3');
const day4 = $('#day-4');
const day5 = $('#day-5');

// consts involving moment for each day of the forecast

const today = moment().format("MM-DD-YYYY");
const tomorrow = moment().add(1, 'days').format("MM-DD-YYYY");
const dayAfterTomorrow = moment().add(2, 'days').format("MM-DD-YYYY");
const dayAfterThat = moment().add(3, 'days').format("MM-DD-YYYY");
const daysLater = moment().add(4, 'days').format("MM-DD-YYYY");

// consts making the moment variables and the day variables into arrays

const days = [day1, day2, day3, day4, day5];
const fiveDay = [today, tomorrow, dayAfterTomorrow, dayAfterThat, daysLater];

// on page load, if there is anything in Local Storage, run the updateList function or otherwise
// set an empty array into local storage.

if (localStorage.getItem("search-history")) {
  updateList()
} else {
  localStorage.setItem("search-history", JSON.stringify([]));
}

// a function used when the button is clicked to run the getApi function

function callApi(event) {
    event.preventDefault();
      getApi();
    };

// a function that makes a variable called locationArray, fills it with info from localStorage, pushes
// newCity if newCity exists and locationArray does not have it, sets locationArray into local Storage,
// clears the list of recent search buttons, then creates the list again based on locationArray using
// a for loop.
// when the buttons generated are clicked, they run a function called 'repurposeSearch'

function updateList(newCity) {
  let locationArray = JSON.parse(localStorage.getItem("search-history"));
  if (newCity && !locationArray.includes(newCity)) {
    locationArray.push(newCity);
  }
  localStorage.setItem("search-history", JSON.stringify(locationArray));
  recentList.empty();
  for (let i = 0; i < locationArray.length; i++) {
    let searchBtn = document.createElement('button');
    searchBtn.textContent = locationArray[i];
    searchBtn.setAttribute('class', 'btn btn-lg btn-secondary w-100 my-2');
    recentList.append(searchBtn);
    searchBtn.onclick = repurposeSearch
}}

// passing along from the previous function, this one takes the textContent from the buttons,
// makes them into a variable, and then uses that variable to run the getApi function.

function repurposeSearch(event) {
    let cityText = event.target.textContent;
    getApi(cityText);
}

// getApi is the function for the Geolocation API to turn a name of a city into latitude and
// longitude coordinates.
// locationInput is set to cityName (the name of the city on the recently-searched button) OR
// the value of what was entered on the original input.

// locationInput is put into the Geolocation API url and then Fetch is used to get the data.
// getForecast function is called with the data as a parameter.

function getApi(cityName) {
    const locationInput = cityName || $('#location').val();
    const geoCall = 'https://api.openweathermap.org/geo/1.0/direct?q='+locationInput+'&appid=379288c134bd33ff0ca6a16b87f06183';
    
    fetch(geoCall)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        getForecast(data);
      })
    }


// getForecast is a function that uses the data to assign latitude and longitude to variables,
// then use those variables in the Open Weather Map API Url to get the necessary location info
// updateList function is called with the name of the location.
// data is passed to popData function, which is called.

function getForecast(locationData) {
  const latitude = locationData[0].lat;
  const longitude = locationData[0].lon;
  const apiCall = 'https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid=379288c134bd33ff0ca6a16b87f06183&units=imperial';

    fetch(apiCall)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    updateList(locationData[0].name);
    popData(data);
    })
}

// popData takes the weatherData, runs the removeContent function, then defines a lot of the
// necessary data into variables so that they can be appended onto the correct elements.

// a for loop is needed for the 5 day forecast, where i is used for weatheData, as well as the
// days and fiveDay arrays above.

// the input value is cleared at the end

function popData(weatherData) {
  removeContent();
  const statusIcon = weatherData.list[0].weather[0].icon;
  const tempNow = weatherData.list[0].main.temp;
  const windNow = weatherData.list[0].wind.speed;
  const humidityNow = weatherData.list[0].main.humidity;
  const sIconUrl = 'https://openweathermap.org/img/wn/'+statusIcon+'.png';
  const imgIcon = '<img src='+sIconUrl+'>';
  locationName.append(weatherData.city.name + ' ' + '('+today+')' + '  ' + imgIcon);
  temp.append('Temp: ' + tempNow + " °F");
  wind.append('Wind: ' + windNow + " MPH");
  humidity.append('Humidity: ' + humidityNow + " %");

  for (let i = 0; i < 5; i++) {
  const weatherStatus = weatherData.list[i].weather[0].icon
  const iconUrl = 'https://openweathermap.org/img/wn/'+weatherStatus+'.png';
  const icon = '<img src='+iconUrl+'>'
  const tempForecast = weatherData.list[i].main.temp;
  const windForecast = weatherData.list[i].wind.speed;
  const humidForecast = weatherData.list[i].main.humidity;
  days[i].append('<h4>' + fiveDay[i] + '<br> </h4>'+ icon +'<h5> <br> Temp: ' 
  + tempForecast + ' °F <br> Wind: ' + windForecast + ' MPH <br> Humidity: ' 
  + humidForecast + ' % </h5>');
  $('#location').val('')
  }};

// removeContent takes all the values that may have been populated previously with popData and 
// clears them.

function removeContent() {
  locationName.empty();
  temp.empty();
  wind.empty();
  humidity.empty();
  for (let i = 0; i < 5; i++) {
    days[i].empty();
}};

// the on-click listener for the Search button that calls the callApi function to start the process.

button.on('click', callApi);