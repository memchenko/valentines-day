function Init() {}

Init.prototype.getAllValentines = function(Valentine, callback) {
	return Valentine.find().exec(callback);
};

module.exports = Init;