const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup Handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDir));

// Routes
app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'Noah M',
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About',
		name: 'Noah M',
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		name: 'Noah M',
		msg:
			"Enter any City name into the search box and click the Search Button. That's all there is to it! Thank you for visiting.",
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.location) {
		return res.send({
			error: 'No location provided',
		});
	}
	geocode(
		req.query.location,
		(error, { latitude, longitude, location } = {}) => {
			if (error) {
				return res.send({
					error,
				});
			}
			forecast(latitude, longitude, (error, forecastData) => {
				if (error) {
					return res.send({
						error,
					});
				}
				res.send({
					location,
					forecast: forecastData,
					address: req.query.location,
				});
			});
		}
	);
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Noah M',
		errorMsg: 'Help article not found',
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Noah M',
		errorMsg: 'Page not found',
	});
});

// Start Server
app.listen(port, () => {
	console.log('Server is up on port ' + port);
});
