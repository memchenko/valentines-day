const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/valentines');

function Valentines() {
	this.Model = mongoose.model('message', new mongoose.Schema({
		from: String,
		to: String,
		message: String
	}));
}

Valentines.prototype.getAllValentines = function(callback) {
	this.Model.find().exec(callback);
};

Valentines.prototype.saveValentine = function(data, callback) {
	const valentine = new this.Model({
		from: data.from,
		to: data.to.length > 0 ? data.to : "N/A",
		message: data.message
	});

	valentine.save((err, valentine) => {
		if (err) callback(err);

		callback(null);
	});
};

module.exports = Valentines;
