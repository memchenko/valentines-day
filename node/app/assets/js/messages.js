$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;
	const STATE = window.APP.STATE;
	const SOCKET = CONSTS.MESSAGES_SOCKET;
	const API_MESSAGES = CONSTS.API_MESSAGES;
	const uiManager = new window.APP.CONSTRUCTORS.UIManager();

	const API_ENDPOINT = API_MESSAGES + '?limit=10&offset=0';

	STATE.isWaitingForMessages = true;
	fetch(API_MESSAGES + '?limit=10&offset=0', {
		method: 'GET',
		mode: 'cors',
		cache: 'no-cache'
	})
	.then((res) => {
		if (res.status >= 400) throw new Error('Не удалось загрузить сообщения');
		return res.json();
	})
	.then((json) => {
		CONSTS.MESSAGES_NUMBER = json.length;

		json.forEach((message) => {
			uiManager.appendMessage(message);
		});

		STATE.isWaitingForMessages = false;
	})
	.catch((err) => {
		uiManager.addNotification('Ошибка', err.message, 'alert-danger');
	});

	CONSTS.INVISIBILITY_BUTTON.addEventListener('click', () => {
		if (STATE.isInvisible) {
			STATE.isInvisible = false;
			uiManager.showVisibleMode();
		} else {
			STATE.isInvisible = true;
			uiManager.showInvisibleMode();
		}
	});
	
	CONSTS.LOAD_MORE_BUTTON.addEventListener('click', () => {
		if (STATE.isWaitingForMessages === true) return;

		STATE.isWaitingForMessages = true;

		fetch(API_MESSAGES + '/api/valentines?limit=5&offset=' + CONSTS.MESSAGES_NUMBER, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache'
		})
		.then((res) => {
			if (res.status >= 400) throw new Error('Не удалось загрузить сообщения');
			return res.json();
		})
		.then((json) => {
			CONSTS.MESSAGES_NUMBER += json.length;

			json.forEach((message) => {
				uiManager.appendMessage(message);
			});
			STATE.isWaitingForMessages = false;
		})
		.catch((err) => {
			uiManager.addNotification('Ошибка', err.message, 'alert-danger');
		});
	});

	SOCKET.on('server: new message', (data) => {
		uiManager.prependMessage(data);
	});

	SOCKET.on('server: message ok', () => {
		uiManager.addNotification('Успех', 'сообщение успешно добавлено!', 'alert-success');
	});

	SOCKET.on('server: message error', (text) => {
		uiManager.addNotification('Ошибка', text, 'alert-danger');
	});
});