function Likes(mongoose) {
	this.Model = mongoose.model('likes', new mongoose.Schema({
		message_id: String,
		likedIPs: Array
	}));
}

Likes.prototype.getLike = function(message_id, callback) {
	this.Model.findById({ '_id': message_id }).exec(callback);
};

Likes.prototype.updateLike = function(message_id) {
	this.Model.findById({ '_id': message_id })
};

Likes.prototype.saveLike = function(data, callback) {
	const likes = new this.Model({
		message_id: String(data.message_id),
		likedIPs: data.likedIPs 
	});

	likes.save((err, message) => {
		if (err) callback(err);

		callback(null);
	});
};

module.exports = Likes;
