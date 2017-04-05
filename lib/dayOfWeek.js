var moment = require('moment-timezone');
var date = new Date();
// syntax ->var Toronto = moment.tz("2014-06-01 12:00", "America/New_York");
var Toronto = moment.tz(date, "America/New_York");
var date = new Date(Toronto);
// call this function for EST ->Toronto.format();    // 2014-06-01T12:00:00-04:00
// sample code below to return date and time
/*var currentdate = new Date();
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();*/


var weekday = new Array(7);
weekday[0] = "Sunday.";
weekday[1] = "Monday =`(";
weekday[2] = "Tuesday.";
weekday[3] = "Wednesday..";
weekday[4] = "Thursday...";
weekday[5] = "Friday!!!";
weekday[6] = "Saturday B-)";

// var today = date(Toronto);
 var dayOfWeek = weekday[date.getDay()];
 //var dayOfWeek = weekday[today.getDay()];
console.log('EST output ' + Toronto);
// var dayOfWeek = weekday[Toronto.getDay()];


// think of export as setting this function to global
exports.getDayOfWeek = function () {
    return dayOfWeek;
}
