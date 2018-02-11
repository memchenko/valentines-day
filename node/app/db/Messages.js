const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/app');

function Messages() {
	this.Model = mongoose.model('message', new mongoose.Schema({
		from: String,
		to: String,
		message: String,
		label: String,
		speaker: String
	}));

	this.speakers = ['alyss', 'jane', 'oksana', 'zahar', 'ermil'];
	this.labels = ['Валентинка', 'Гадость', 'Шутка', 'Секрет', 'Идея'];
}

Messages.prototype.getAllMessages = function(callback) {
	this.Model.find().exec(callback);
};

Messages.prototype.getMessages = function(limit, offset, callback){
	this.Model.find().skip(offset).limit(limit).exec(callback);
};

Messages.prototype.saveMessage = function(data, callback) {
	const label = this.labels.some((val) => val === String(data.label)) ? String(data.label) : 'Сообщение';
	const speaker = this.speakers.some((val) => val === String(data.speaker)) ? String(data.speaker) : 'alyss';

	const message = new this.Model({
		from: String(data.from),
		to: String(data.to).length > 0 ? String(data.to) : "N/A",
		message: String(data.message),
		label: label,
		speaker: speaker
	});

	message.save((err, message) => {
		if (err) callback(err);

		callback(null);
	});
};

module.exports = Messages;
