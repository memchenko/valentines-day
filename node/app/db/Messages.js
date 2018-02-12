function Messages(mongoose) {
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

Messages.prototype.validateInput = function(data) {
	const NAME_MAX_LENGTH = 20;
	const MESSAGE_MAX_LENGTH = 100;
	const IS_CORRECT_LABEL = this.labels.some((val) => val === String(data.label));
	const IS_CORRECT_SPEAKER = this.speakers.some((val) => val === String(data.speaker));

	switch (true) {
		case data.from.length > NAME_MAX_LENGTH: {
			return 'Превышено количество символов в имени отправителя';
		}
		case data.to.length > NAME_MAX_LENGTH: {
			return 'Превышено количество символов в имени получателя';
		}
		case data.message.length > MESSAGE_MAX_LENGTH: {
			return 'Превышено количество символов в сообщении';
		}
		case !IS_CORRECT_LABEL: {
			return 'Здесь трудно было допустить ошибку, но тебе удалось - незнакомая приставка';
		}
		case !IS_CORRECT_SPEAKER: {
			return 'Не знаю такого спикера';
		}
		default: return 'OK';
	}
};

Messages.prototype.getAllMessages = function(callback) {
	this.Model.find().exec(callback);
};

Messages.prototype.getMessages = function(limit, offset, callback){
	this.Model.find().skip(offset).limit(limit).exec(callback);
};

Messages.prototype.saveMessage = function(data, callback) {
	const message = new this.Model({
		from: String(data.from),
		to: String(data.to).length > 0 ? String(data.to) : "N/A",
		message: String(data.message),
		label: data.label,
		speaker: data.speaker
	});

	message.save((err, message) => {
		if (err) callback(err);

		callback(null);
	});
};

module.exports = Messages;
