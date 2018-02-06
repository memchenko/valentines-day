function ValentineManager() {}

ValentineManager.prototype.saveMessage = function(data, Valentine, callback) {
	const valentine = new Valentine({
		from: data.from,
		to: data.to.length > 0 ? data.to : "N/A",
		message: data.message
	});

	valentine.save((err, valentine) => {
		if (err) callback(false);

		callback(true);

	});
}

module.exports = ValentineManager;