let chalk = require('chalk');
let client = require('./client');
let pretty = require('prettyjson');

let modelId = process.argv[2];

if (!modelId) {

	console.log(chalk.red('Usage: `node monitor-training <Model ID>`'), '\n');
	process.exit();

}

let uri = `/train/${modelId}`;
console.log(chalk.yellow('* Getting training status...'), '\n');

client.get(uri, (err, response, body) => {

	if (err) { throw err; }

	let data = JSON.parse(body);
	console.log(pretty.render(data));

	if (data.status == 'SUCCEEDED') {
		console.log('\n', chalk.white.bold('~ YAY ~'), '\n');
	}

});
