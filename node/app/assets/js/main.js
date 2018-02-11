$(document).ready(() => {
	window.APP = APP = window.APP || {};
	APP.CONSTS = CONSTS = APP.CONSTS || {};
	APP.STATE = STATE = APP.STATE || {};

	CONSTS.HOSTNAME = window.location.hostname;
	CONSTS.MAIN_PORT = window.location.port;
	CONSTS.MESSAGES_PORT = '3000';
	CONSTS.PAINTINGS_PORT = '3030';
	CONSTS.WINDOW_WIDTH = window.innerWidth;

	// *** FROM GROUP ELEMENTS ***
	CONSTS.FROM_INPUT = document.querySelector('#from');
	CONSTS.TO_INPUT = document.querySelector('#to');
	CONSTS.MESSAGE_INPUT = document.querySelector('#message');
	CONSTS.REMAINDER_CONTAINER = document.querySelector('#remainder');
	CONSTS.LABEL_SELECT = document.querySelector('#label');
	CONSTS.SPEAKER_SELECT = document.querySelector('#speaker');
	CONSTS.SUBMIT_BUTTON = document.querySelector('#submit');
	CONSTS.WRITE_VALENTINE_BUTTON = document.querySelector('#write-valentine-btn');

	// *** MESSAGE GROUP ELEMENTS ***
	CONSTS.INVISIBILITY_BUTTON = document.querySelector('#invisibility');
	CONSTS.MESSAGES_CONTAINER = document.querySelector('#messages');
	CONSTS.LOAD_MORE_BUTTON = document.querySelector('#load-more-btn');

	// *** CANVAS GROUP ELEMENTS ***
	CONSTS.CANVAS = document.querySelector('#canvas');
	CONSTS.ADD_SPACE_BUTTON = document.querySelector('#add-space-btn');
	CONSTS.PALETTE = document.querySelector('#palette');

	// *** NOTIFICATIONS ***
	CONSTS.NOTIFICATIONS_WRAPPER = document.querySelector('#notifications');

	// *** APIs ***
	CONSTS.API_MESSAGES = 'http://' + CONSTS.HOSTNAME + ':' + CONSTS.MESSAGES_PORT + '/api/messages';
	CONSTS.API_PAINTINGS = 'http://' + CONSTS.HOSTNAME + ':' + CONSTS.PAINTINGS_PORT + '/api/paintings';

	// *** SOCKETS ***
	CONSTS.MESSAGES_SOCKET = io.connect('http://' + CONSTS.HOSTNAME + ':' + CONSTS.MESSAGES_PORT);
	CONSTS.PAINTINGS_SOCKET = io.connect('http://' + CONSTS.HOSTNAME + ':' + CONSTS.PAINTINGS_PORT);

	CONSTS.MESSAGES_NUMBER = 0;

	STATE = {
		isWaitingForMessages: false,
		isInvisible: false,
		isSendingMessage: false
	};
}); 

$(document).ready(() => {
	$('*[data-toggle="tooltip"]').tooltip();

	if (window.APP.CONSTS.WINDOW_WIDTH < 960) {
		let isFormOpened = false;

		CONSTS.WRITE_VALENTINE_BUTTON.addEventListener('click', () => {
			if (isFormOpened) {
				isFormOpened = false;
				$('.form').removeClass('form--opened');
			} else {
				isFormOpened = true;
				$('.form').addClass('form--opened');
			}			
		});
	}
});
