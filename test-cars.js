let fs = require('fs');
let chalk = require('chalk');
let client = require('./client');
let pretty = require('prettyjson');

let modelId = process.argv[2];
let image = process.argv[3];

if (!modelId || !image) {

	console.log(chalk.red('Usage: `node test-cars <model id> <file location>`'), '\n');
	process.exit();

}

let formData = {
	modelId,
	sampleContent: fs.createReadStream(image)
}

client.post({ uri: '/predict', formData }, (err, response, body) => {

	if (err) { throw err; }

	let data = JSON.parse(body);
	console.log(pretty.render(data));
});
