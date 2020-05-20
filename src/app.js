const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

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
		title: 'About Me',
		name: 'Noah M',
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		name: 'Noah M',
		msg: 'This is some very helpful text.',
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
app.listen(3000, () => {
	console.log('Server is up on port 3000');
});
