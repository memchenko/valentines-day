const fs = require('fs');
const path = require('path');

let canvasJSON = require('./canvas.json');

function Paintings(mongoose) {
	this.Model = mongoose.model('shapes', new mongoose.Schema({
		color: String,
		coords: Array
	}));

	this.canvas = canvasJSON;
}

Paintings.prototype.getCanvasHeight = function() {
	return this.canvas.height;
};

Paintings.prototype.isIPCatched = function(ip) {
	return this.canvas.ips.some((val) => val === ip);
};

Paintings.prototype.putNewIP = function(ip) {
	this.canvas.ips.push(ip);

	const newJSON = JSON.stringify(this.canvas);

	return new Promise((resolve, reject) => {
		fs.open(path.resolve(__dirname, './canvas.json'), 'w', undefined, (err, fd) => {
			if (err) {
				reject(err);
				return;
			}

			fs.write(fd, newJSON, undefined, undefined, (err, written, string) => {
				if (err) {
					fs.close(fd, () => reject(err));
					return;
				}

				fs.close(fd, () => resolve());
			});
		});
	});
};

Paintings.prototype.saveCanvasHeight = function(height) {
	this.canvas.height = height;
	const newHeight = this.canvas.height;
	const newJSON = JSON.stringify(this.canvas);

	return new Promise((resolve, reject) => {
		fs.open(path.resolve(__dirname, './canvas.json'), 'w', undefined, (err, fd) => {
			if (err) {
				reject(err);
				return;
			}

			fs.write(fd, newJSON, undefined, undefined, (err, written, string) => {
				if (err) {
					fs.close(fd, () => reject(err));
					return;
				}

				fs.close(fd, () => resolve(newHeight));
			});
		});
	});	
};

Paintings.prototype.getAllPaintings = function(callback) {
	this.Model.find().exec(callback);
};

Paintings.prototype.savePainting = function(data, callback) {
	const shape = new this.Model({
		color: String(data.color),
		coords: data.coords
	});

	shape.save((err, shape) => {
		if (err) callback(err);

		callback(null);
	});
};

module.exports = Paintings;
