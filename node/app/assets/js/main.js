$(document).ready(() => {
	window.APP = APP = window.APP || {};
	APP.CONSTS = CONSTS = APP.CONSTS || {};
	APP.STATE = STATE = APP.STATE || {};

	CONSTS.HOST = window.location.host;
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

	// CONSTS.API_GET_VALENTINES = 'http://' + CONSTS.HOST + '/valentines';

	CONSTS.SOCKET = {}; //io.connect('http://' + CONSTS.HOST);

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
