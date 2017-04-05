// Express setup
var express = require('express');
var app = express();


var bodyParser = require('body-parser');

// Custom scripts
var fortune = require('./lib/fortune.js');
// var moment = require('moment-timezone');
var credentials = require('./credentials.js');

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

var date = new Date();
var dayOfWeek = require('./lib/dayOfWeek.js');


var fortune = require('./lib/fortune.js');
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
app.use(require('body-parser').urlencoded({ extended: true }));
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
// ch.9 stuff
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}));
app.use(function(req, res, next){
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
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
// from CH8 ex. 8-1
app.get('/newsletter', function(req, res){
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
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

// monster and signed_monster from ch. 9
app.get('/', function (req, res) {
    res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'nom nom', { signed: true });

    res.render('home', {
        dayOfWeek: dayOfWeek.getDayOfWeek()
    });
});

// monster and signed_monster from ch. 9
app.get('/about', function (req, res) {

    var monster = req.cookies.monster;
    var signedMonster = req.signedCookies.signed_monster;

    console.log('Monster: ' + monster);
    console.log('signed Monster: ' + signedMonster);

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

app.get('/newsletter', function(req, res){
    res.render('newsletter');
});

app.get('/newsletter/archive', function(req, res){
    res.render("newsletter/archive");
});



// chapter 7 client side handlebars - pg 83+
app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'honey badger',
        bodyPart: 'tail',
        adjective: 'ferocious',
        noun: 'heck'
    });
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

// from CH8  ex. 8-1
app.post('/process', function(req, res){
    console.log('Form (from querystring): ' + req.query.form);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thank-you');
});

// from ch.9 pg 108
// slightly modified version of the official W3C HTML5 email regex:
// https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
function NewsletterSignup() {};
NewsletterSignup.prototype.save = function (cb) {
    cb();
}

var VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' +
                                   '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
                                   '(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

app.post('/newsletter', function(req, res){
    var name = req.body.name || '', email = req.body.email || '';
    // input validation
    if(!email.match(VALID_EMAIL_REGEX)) {
        if(req.xhr) return res.json({ error: 'Invalid name email address.' });
        req.session.flash = {
            type: 'danger',
            intro: 'Validation error!',
            message: 'The email address you entered was not valid.'
        };
        return res.redirect(303, '/newsletter/archive');
    }
    // NewsletterSignup is an example of an object you might create;
    // since every implementation will vary, it is up to you to write these
    // project-specific interfaces. This simply shows how a typical Express
    // implementation might look in your project.
    new NewsletterSignup({ name: name, email: email }).save(function(err){
        if(err) {
            if(req.xhr) return res.json({ error: 'Database error.' });
            req.session.flash = {
                type: 'danger',
                intro: 'Database error!',
                message: 'There was a database error; please try again later.'
            }
            return res.redirect(303, '/newsletter/archive');
        }
        if(req.xhr) return res.json({ success: true });
        req.session.flash = {
            type: 'success',
            intro: 'Thank you!',
            message: 'You have now been signed up for the newsletter.'
        };
        return res.redirect(303, '/newsletter/archive');
    });
});


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
