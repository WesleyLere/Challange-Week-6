const day1 = $('#day-1');
const day2 = $('#day-2');
const day3 = $('#day-3');
const day4 = $('#day-4');
const day5 = $('#day-5');
const button = $('#btn');
const recentList = $('#recent-list');
const locationName = $('#location-name');
const temp = $('#temperature');
const wind = $('#wind');
const humidity = $('#humidity');
const forecast = $('#forecast');

const date1 = moment().format("MM-DD-YYYY");
const date2 = moment().add(1, 'days').format("MM-DD-YYYY");
const date3 = moment().add(2, 'days').format("MM-DD-YYYY");
const date4 = moment().add(3, 'days').format("MM-DD-YYYY");
const date5 = moment().add(4, 'days').format("MM-DD-YYYY");


const days = [day1, day2, day3, day4, day5];
const fiveDay = [date1, date2, date3, date4, date5];


if (localStorage.getItem("search-history")) {
  updateList()
} else {
  localStorage.setItem("search-history", JSON.stringify([]));
}


function callApi(event) {
    event.preventDefault();
      getWeather();
    };


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

function repurposeSearch(event) {
    let cityText = event.target.textContent;
    getWeather(cityText);
}

function getWeather(cityName) {
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


function popData(weatherData) {
  removeContent();
  const statusIcon = weatherData.list[0].weather[0].icon;
  const tempNow = weatherData.list[0].main.temp;
  const windNow = weatherData.list[0].wind.speed;
  const humidityNow = weatherData.list[0].main.humidity;
  const sIconUrl = 'https://openweathermap.org/img/wn/'+statusIcon+'.png';
  const imgIcon = '<img src='+sIconUrl+'>';
  locationName.append(weatherData.city.name + ' ' + ''+date1+'' + '  ' + imgIcon);
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

function removeContent() {
  locationName.empty();
  temp.empty();
  wind.empty();
  humidity.empty();
  for (let i = 0; i < 5; i++) {
    days[i].empty();
}};

button.on('click', callApi);