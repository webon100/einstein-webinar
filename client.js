let request = require('request');

let api = 'https://api.metamind.io/v1/vision';
let token = '42c1ef7eeb1bdfff9e117037e7a76f8d5f32a34d';

let client = request.defaults({
	baseUrl: api,
	headers: {
		'Authorization': `Bearer ${token}`,
		'Cache-Control': 'no-cache',
	},
	pool: {
		maxSockets: Infinity // and beyond!
	}
});

module.exports = client;
