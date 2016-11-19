let fs = require('fs');
let path = require('path');
let async = require('async');
let chalk = require('chalk');
let client = require('./client');
let pretty = require('prettyjson');

let dir = require('node-dir');

let formData = {
	name: 'cars',
	labels: 'audi,bmw,tesla'
};

console.log(chalk.yellow(`* Creating ${formData.name} dataset...`), '\n');

client.post({ uri: '/datasets', formData }, (err, response, body) => {

	if (err) { throw err; }
	let dataset = JSON.parse(body);

	console.log(chalk.green('HTTP status:'), response.statusCode);
	console.log(chalk.green('dataset id:'), dataset.id);

	let labels = dataset.labelSummary.labels;
	let names = labels.map((label) => { return label.name });
	let lookup = { };
	let count = 0;

	labels.forEach((label) => { lookup[label.name] = label.id; });

	console.log(chalk.green('labels:'), names.join(', '), '\n');

	dir.paths('./cars', (err, paths) => { // get all the files in the cars dir

		if (err) { throw err; }
		console.log(chalk.yellow('* Uploading example images...'), '\n');

		let uploads = paths.files.map((file) => {

			return function(callback) {

				let uri = `/datasets/${dataset.id}/examples`;
				let split = file.split(path.sep);
				let formData = {
					labelId: lookup[split[1]], // id from the dataset's labels
					name: split[2], // filename
					data: fs.createReadStream(path.join(__dirname, file))
				}

				client.post({ uri, formData }, (err, response, body) => {

					if (err) { callback(err); }

					console.log(chalk.yellow(`Uploaded image ${++count}:`));
					console.log(pretty.render(JSON.parse(body)), '\n');
					callback(null);

				});

			};

		});

		async.parallel(uploads, (err, results) => {

			console.log(chalk.yellow('* Done uploading examples.'), '\n');
			console.log(chalk.yellow('* Creating model for dataset...'), '\n');
			train();

		});

	});

	function train() {

		let uri = '/train';
		let formData = {
			datasetId: dataset.id,
			name: dataset.name
		};
		client.post({ uri, formData }, (err, response, body) => {

			if(err) { throw err; }
			let data = JSON.parse(body);

			console.log(pretty.render(data));

		});
	}

});
