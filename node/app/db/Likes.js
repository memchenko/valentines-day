function Likes(mongoose) {
	this.Model = mongoose.model('likes', new mongoose.Schema({
		message_id: String,
		likedIPs: Array
	}));
}

Likes.prototype.getLike = function(message_id) {
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

Likes.prototype.likeMessage = function(message_id, ip) {
	const _this = this;

	return new Promise((resolve, reject) => {
		_this.getLike(message_id)
		.then((doc) => {
			const isLikeHasIP = doc.likedIPs.some(val => val === ip);

			if (isLikeHasIP) {
				reject();
				return;
			}

			doc.likedIPs = doc.likedIPs.concat([ip]);
			doc.save(() => resolve({ likesNumber: doc.likedIPs.length, messageId: message_id }));
		})
		.catch((err) => {
			reject();
		});
	});
};

Likes.prototype.unlikeMessage = function(message_id, ip) {
	const _this = this;

	return new Promise((resolve, reject) => {
		_this.getLike(message_id)
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

Likes.prototype.saveLike = function(data, callback) {
	const likes = new this.Model({
		message_id: String(data.message_id),
		likedIPs: data.likedIPs 
	});

	likes.save((err, like) => {
		if (err) callback(err);

		callback(null);
	});
};

module.exports = Likes;
