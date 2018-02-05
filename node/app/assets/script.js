var socket = io.connect('http://localhost:3000');
socket.emit('new valentine', { test: "whatever" });
socket.on('send valentine', (data) => {
	console.log(data);
});

(function() {
	fetch('http://localhost:3000/valentines', {
		mode: "GET"
	})
	.then(data => data.json())
	.then(json => console.dir(json));
}());