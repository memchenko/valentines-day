function Messages(mongoose) {
	this.Model = mongoose.model('message', new mongoose.Schema({
		from: String,
		to: String,
		message: String,
		label: String,
		speaker: String,
		likedIPs: Array
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
		case data.to.length === 0 || data.to.trim() === '': {
			return 'Без получателя не принимаю';
		}
		case data.to.length > NAME_MAX_LENGTH || data.to.trim() === '': {
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
	this.Model.find({}, {}, { sort: { '_id': -1 } }).skip(offset).limit(limit).exec(callback);
};

Messages.prototype.saveMessage = function(data, callback) {
	const message = new this.Model({
		from: String(data.from).length > 0 ? String(data.from) : 'Аноним',
		to: String(data.to).length > 0 ? String(data.to) : "Аноним",
		message: String(data.message),
		label: data.label,
		speaker: data.speaker,
		likedIPs: []
	});

	message.save((err, message) => {
		if (err) callback(err);

		callback(null, message);
	});
};

Messages.prototype.getMessage = function(message_id) {
	return new Promise((resolve, reject) => {
		this.Model.findById({ '_id': message_id }).exec((err, doc) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(doc);
		});
	});
};

Messages.prototype.likeMessage = function(message_id, ip) {
	const _this = this;

	return new Promise((resolve, reject) => {
		_this.getMessage(message_id)
		.then((doc) => {
			const isLikeHasIP = doc.likedIPs.some(val => val === ip);

			if (isLikeHasIP) {
				reject();
				return;
			}
<<<<<<< HEAD
=======

>>>>>>> 5626fef829f0d2e6f5c67f9d8f0d28718b17b63d
			doc.likedIPs = doc.likedIPs.concat([ip]);
			doc.save(() => resolve({ likesNumber: doc.likedIPs.length, messageId: message_id }));
		})
		.catch((err) => {
			reject();
		});
	});
};

Messages.prototype.unlikeMessage = function(message_id, ip) {
	const _this = this;

	return new Promise((resolve, reject) => {
		_this.getMessage(message_id)
		.then((doc) => {
			const isLikeHasIP = doc.likedIPs.some(val => val === ip);

			if (!isLikeHasIP) {
				reject();
				return;
			}

			const indexOfIP = doc.likedIPs.indexOf(ip);
			doc.likedIPs = doc.likedIPs
				.slice(0, indexOfIP)
				.concat(
					doc.likedIPs.slice(indexOfIP + 1)
				);
			doc.save(() => resolve({ likesNumber: doc.likedIPs.length, messageId: message_id }));
		})
		.catch((err) => {
			reject();
		});
	});
};

module.exports = Messages;
