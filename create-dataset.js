let fs = require('fs');
let chalk = require('chalk');
let client = require('./client');
let pretty = require('prettyjson');

let formData = {
	name: 'cars',
	labels: 'audi,bmw,tesla'
};

console.log(chalk.yellow(`* Creating ${formData.name} dataset...`));
client.post({ uri: '/datasets', formData }, (err, response, body) => {

	if (err) { throw err; }

	console.log(chalk.green('HTTP status:'), response.statusCode);
	console.log(pretty.render(JSON.parse(body)));
});
