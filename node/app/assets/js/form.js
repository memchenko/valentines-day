$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;
	const uiManager = new window.APP.CONSTRUCTORS.UIManager();

	CONSTS.MESSAGE_INPUT.addEventListener('keyup', () => {
		const MESSAGE_LENGTH = CONSTS.MESSAGE_INPUT.value.length;
		const MAX_LENGTH = 100;
		const REMAINDER = MAX_LENGTH - MESSAGE_LENGTH < 0 ? 0 : MAX_LENGTH - MESSAGE_LENGTH;

		uiManager.setMessageRemainder(REMAINDER);
	});

	CONSTS.SUBMIT_BUTTON.addEventListener('click', () => {
		if (CONSTS.STATE.isSendingMessage === true) return;

		CONSTS.STATE.isSendingMessage = true;

		uiManager.makeSubmitBtnWaiting();

		CONSTS.SOCKET.emit('new valentine', {
			from: CONSTS.FROM_INPUT.value,
			to: CONSTS.TO_INPUT.value,
			message: CONSTS.MESSAGE_INPUT.value,
			label: CONSTS.LABEL_SELECT.value,
			speaker: CONSTS.SPEAKER_SELECT.value
		});
	});

	CONSTS.SOCKET.on('error valentine', () => {
		CONSTS.STATE.isSendingMessage = false;

		uiManager.resetSubmitBtn();
	});

	CONSTS.SOCKET.on('ok valentine', () => {
		CONSTS.STATE.isSendingMessage = false;

		uiManager.resetSubmitBtn().clearForm().resetMessageRemainder();
	});


});