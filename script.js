var button = $("#btn");
var recentList = $('#recentList');
var locationName = $("#locationName")
var temp = $('#temp')
var wind = $('#wind')
var humidity = $('#humidity');
var forecast = $('#forecast');
var day1 = $('#day-1');
var day2 = $('#day-2');
var day3 = $('#day-3');
var day4 = $('#day-4');
var day5 = $('#day-5');

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=35.5&lon=-78.5",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "1de65c19c5msh9876d1e1d58d892p118e56jsn90eaf3b097de",
		"X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});