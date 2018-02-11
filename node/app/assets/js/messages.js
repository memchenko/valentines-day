$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;
	const STATE = window.APP.STATE;
	const uiManager = new window.APP.CONSTRUCTORS.UIManager();

	CONSTS.INVISIBILITY_BUTTON.addEventListener('click', () => {
		if (STATE.isInvisible) {
			STATE.isInvisible = false;
			uiManager.showVisibleMode();
		} else {
			STATE.isInvisible = true;
			uiManager.showInvisibleMode();
		}
	});

	CONSTS.MESSAGES_CONTAINER;
	
	CONSTS.LOAD_MORE_BUTTON.addEventListener('click', () => {
		if (STATE.isWaitingForMessages === true) return;

		STATE.isWaitingForMessages = true;

		fetch(CONSTS.HOST + '/api/valentines?q=5&offset=' + CONSTS.MESSAGES_NUMBER, {
			mode: 'GET'
		})
		.then((res) => {
			if (res.status !== 200) throw new Error('Не смог загрузить сообщения');
			res.json();
		})
		.then((json) => {
			json.forEach((el, i) => {
				uiManager.appendMessage(el);
			});
			STATE.isWaitingForMessages = false;
		})
		.catch((err) => {
			uiManager.addNotification('Ошибка', err.message, 'alert-danger');
		});
	});

	CONSTS.SOCKET.on('send valentine', (data) => {
		uiManager.prependMessage(data);
	});
});