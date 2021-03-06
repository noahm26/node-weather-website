const request = require('postman-request');

const forecast = (lat, long, callback) => {
	const url =
		'http://api.weatherstack.com/current?access_key=c73e6614a988b9acd570783336124a27&query=' +
		lat +
		',' +
		long +
		'&units=f';
	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service', undefined);
		} else if (body.error) {
			callback('Unable to find location', undefined);
		} else {
			const {
				weather_descriptions,
				temperature,
				feelslike,
				weather_icons,
			} = body.current;
			let weather = '';
			if (weather_descriptions[0]) {
				weather += weather_descriptions[0] + '. ';
			}
			weather += 'It is currently ' + temperature + ' degrees outside';
			if (temperature === feelslike) {
				weather += '.';
			} else {
				weather += ' but feels like ' + feelslike + ' degrees.';
			}
			const weatherInfo = {
				weather,
				icon: weather_icons[0],
			};
			callback(undefined, weatherInfo);
		}
	});
};

module.exports = forecast;
