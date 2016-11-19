let fs = require('fs');
let chalk = require('chalk');
let client = require('./client');
let pretty = require('prettyjson');

let formData = {
	modelId: 'FoodImageClassifier', // pre-trained! ^-^
	sampleContent: fs.createReadStream('./car-1.jpg')
};

client.post({ uri: '/predict', formData }, (err, response, body) => {

	if (err) { throw err; }

	console.log(chalk.green('status code:'), response.statusCode);
	console.log(pretty.render(JSON.parse(body)));
});
