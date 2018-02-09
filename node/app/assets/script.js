(function() {
	const host = window.location.host;

	fetch('http://' + host + '/valentines', {
		mode: "GET",
		cors: "same-origin"
	})
	.then(data => data.json())
	.then(json => console.dir(json));
}());

(function() {
	const host = window.location.host;

	const socket = io.connect('http://' + host);

	const FROM_INPUT = document.querySelector('#from');
	const TO_INPUT = document.querySelector('#to');
	const MESSAGE_INPUT = document.querySelector('#message');
	const SUBMIT_BUTTON = document.querySelector('#submit');

	SUBMIT_BUTTON.addEventListener('click', () => {	
		socket.emit('new valentine', {
			from: FROM_INPUT.value,
			to: TO_INPUT.value,
			message: MESSAGE_INPUT.value
		});
	});
	
	const OUTPUT = document.querySelector('#output');

	socket.on('send valentine', (data) => {
		OUTPUT.innerHTML += 
		`<p>
			<strong>От: </strong>${data.from}
		</p>
		<p>
			<strong>Кому: </strong>${data.to}
		</p>
		<p>
			<strong>Сообщение:</strong><br>
			${data.message}
		</p>`;		
	});

}());