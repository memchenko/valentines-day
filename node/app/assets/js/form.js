$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;
	const SOCKET = CONSTS.MESSAGES_SOCKET;
	const uiManager = new window.APP.CONSTRUCTORS.UIManager();

	CONSTS.MESSAGE_INPUT.addEventListener('keyup', () => {
		const TEXT_LENGTH = CONSTS.MESSAGE_INPUT.value.length;
		const MAX_LENGTH = 100;
		const REMAINDER = MAX_LENGTH - TEXT_LENGTH < 0 ? 0 : MAX_LENGTH - TEXT_LENGTH;

		uiManager.setMessageRemainder(REMAINDER);
	});

	CONSTS.FROM_INPUT.addEventListener('keyup', () => {
		const TEXT_LENGTH = CONSTS.FROM_INPUT.value.length;
		const MAX_LENGTH = 20;
		const REMAINDER = MAX_LENGTH - TEXT_LENGTH < 0 ? 0 : MAX_LENGTH - TEXT_LENGTH;

		uiManager.setFromRemainder(REMAINDER);
	});

	CONSTS.TO_INPUT.addEventListener('keyup', () => {
		const TEXT_LENGTH = CONSTS.TO_INPUT.value.length;
		const MAX_LENGTH = 20;
		const REMAINDER = MAX_LENGTH - TEXT_LENGTH < 0 ? 0 : MAX_LENGTH - TEXT_LENGTH;

		uiManager.setToRemainder(REMAINDER);
	});

	CONSTS.SUBMIT_BUTTON.addEventListener('click', () => {
		window.APP.STATE.isSendingMessage = true;

		uiManager.makeSubmitBtnWaiting();
		
		SOCKET.emit('client: put message', {
			from: CONSTS.FROM_INPUT.value,
			to: CONSTS.TO_INPUT.value,
			message: CONSTS.MESSAGE_INPUT.value,
			label: CONSTS.LABEL_SELECT.value,
			speaker: CONSTS.SPEAKER_SELECT.value
		});
	});

	SOCKET.on('server: message error', () => {
		window.APP.STATE.isSendingMessage = false;

		uiManager.resetSubmitBtn();
	});

	SOCKET.on('server: message ok', () => {
		window.APP.STATE.isSendingMessage = false;

		uiManager.resetSubmitBtn().clearForm().resetMessageRemainder();
	});
});