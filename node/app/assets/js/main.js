$(document).ready(() => {
	window.APP = APP = window.APP || {};
	APP.CONSTS = CONSTS = APP.CONSTS || {};
	APP.STATE = STATE = APP.STATE || {};

	CONSTS.HOST = window.location.host;

	// *** FROM GROUP ELEMENTS ***
	CONSTS.FROM_INPUT = document.querySelector('#from');
	CONSTS.TO_INPUT = document.querySelector('#to');
	CONSTS.MESSAGE_INPUT = document.querySelector('#message');
	CONSTS.REMAINDER_CONTAINER = document.querySelector('#remainder');
	CONSTS.LABEL_SELECT = document.querySelector('#label');
	CONSTS.SPEAKER_SELECT = document.querySelector('#speaker');
	CONSTS.SUBMIT_BUTTON = document.querySelector('#submit');

	// *** MESSAGE GROUP ELEMENTS ***
	CONSTS.INVISIBILITY_BUTTON = document.querySelector('#invisibility');
	CONSTS.MESSAGES_CONTAINER = document.querySelector('#messages');
	CONSTS.LOAD_MORE_BUTTON = document.querySelector('#load-more-btn');

	// *** CANVAS GROUP ELEMENTS ***
	CONSTS.CANVAS = document.querySelector('#canvas');
	CONSTS.ADD_SPACE_BUTTON = document.querySelector('#add-space-btn');

	// *** NOTIFICATIONS ***
	CONSTS.NOTIFICATIONS_WRAPPER = document.querySelector('#notifications');

	// CONSTS.API_GET_VALENTINES = 'http://' + CONSTS.HOST + '/valentines';

	CONSTS.SOCKET = io.connect('http://' + CONSTS.HOST);

	STATE = {
		isWaitingForMessages: false,
		isInvisible: false,
		isSendingMessage: false
	};
}); 

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

$(document).ready(() => {
	$('*[data-toggle="tooltip"]').tooltip();
});