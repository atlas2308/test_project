// Express setup
var express = require('express');
var app = express();


var bodyParser = require('body-parser');

// Custom scripts
var fortune = require('./lib/fortune.js');
// globals
function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Kitchener',
                forecastUrl: 'https://www.wunderground.com/ca/on/kitchener.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Snow Flurries',
                temp: '32.0 F (0 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}
var dayOfWeek = require('./lib/dayOfWeek.js');
var date = Date();

var fortune = require('./lib/fortune.js');
var dayOfWeek = require('./lib/dayOfWeek.js');
var bodyParser = require('body-parser');

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];
var copyrightYear = require('./lib/copyrightYear.js');

// set up handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        copyrightYear: copyrightYear.getCurYear(),
        section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');



var urlEncodedParser = bodyParser.urlencoded({ extended: false });

// Custom scripts

app.disable('x-powered-by');

app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || 'localhost');

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weatherContext = getWeatherData();
    next();
});


// Health check
app.get('/health', function (req, res) {
    res.status(200);
    res.render('health');
});
// from CH.7
app.get('/jquery-test', function (req, res){
    res.render('jquery-test');
});

// Display header info
app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = '';
    for (var name in req.headers) {
        s += name + ': ' + req.headers[name] + '\n';
    };
    res.send(s);
});

// ##Routes
app.get('/', function (req, res) {
    res.render('home', {
        dayOfWeek: dayOfWeek.getDayOfWeek()
    });
});

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune(),
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/thank-you', function (req, res){
    res.render('thank-you');
});

app.get('/tours/tours-info', function (req, res){
    res.render('tours/tours-info', {
        currency: {
            name: 'Canadian dollars',
            abbrev: 'CDN'
        },
        tours: [
            {
                name: 'Hood River',
                price: '99.95'
            },
            {
                name: 'Oregon Coast',
                price: '159.95'
            }
        ],
        specialsUrl: '/january-specials',
        currencies: ['USD', 'CDN', 'BTC']
    });

});


app.get('/tours/hood-river', function (req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function (req, res) {
    res.render('tours/oregon-coast');
});


app.get('/tours/request-group-rate', function (req, res) {
    res.render('tours/request-group-rate');
});

app.get('/api/tours', function(req, res){
    res.json(tours);
});

/*app.get('/api/tours', function(req, res){
    var toursXml = '<?xml version="1.0"?><tours>' +
        products.map(function(p){
            return '<tour price="' + p.price +
                '" id="' + p.id + '">' + p.name + '</tour>';
        }).join('') + '</tours>';
    var toursText = tours.map(function(p){
        return p.id + ': ' + p.name + ' (' + p.price + ')';
    }).join('\n');
    res.format({
        'application/json': function(){
            res.json(tours);
        },
        'application/xml': function(){
            res.type('application/xml');
            res.send(toursXml);
        },
        'text/xml': function(){
            res.type('text/xml');
            res.send(toursXml);
        }
        'text/plain': function(){
        res.type('text/plain');
        res.send(toursXml);
    }
               });
});*/


app.post('/process-contact', urlEncodedParser, function(req, res){
    var conName = req.body.name;
    var curTime = date.toString();

    console.log('Received contact from '+ req.body.name +
                ' <' + req.body.email + '> ' + curTime);

    var conName = req.body.name;
    var curTime = date.toString();
    // save to database...

    //res.redirect(303, '/thank-you');
    res.status(303);
    res.render('thank-you', {
        timeStamp: curTime,
        contactName: conName
    });
});


app.get('/thank-you', function(req,res){
    res.render('thank-you');
});

// example 6-9, see top of file where bodyParser middleware details added
app.post('/process-contact', urlEncodedParser, function (req, res) {
    console.log('Received contact from ' + req.body.name +
                ' <' + req.body.email + '>');
    // save to database....
    res.redirect(303, '/thank-you');
});

// Custom 404 page
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});


// Custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// the listen should remain at the bottom
app.listen(app.get('port'), app.get('ip'), function () {
    console.log('Express started on http://' + app.get('ip') + ':' + app.get('port') + '; press Ctrl-C to terminate.');
});
