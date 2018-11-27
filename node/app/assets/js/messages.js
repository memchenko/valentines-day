$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;
	const STATE = window.APP.STATE;
	const SOCKET = CONSTS.MESSAGES_SOCKET;
	const API_MESSAGES = CONSTS.API_MESSAGES;
	const uiManager = new window.APP.CONSTRUCTORS.UIManager();

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

		fetch(API_MESSAGES + '?limit=5&offset=' + CONSTS.MESSAGES_NUMBER, {
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

			if (json.length === 0) uiManager.addNotification('Пусто', 'Уже загружены все сообщения', 'alert-warning');

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
		CONSTS.MESSAGES_NUMBER += 1;

		uiManager.prependMessage(data);
	});

	SOCKET.on('server: message ok', () => {
		uiManager.addNotification('Успех', 'сообщение успешно добавлено!', 'alert-success');
	});

	SOCKET.on('server: message error', (text) => {
		uiManager.addNotification('Ошибка', text, 'alert-danger');
	});

	SOCKET.on('server: like message', (obj) => {
		uiManager.updateLike(obj.messageId, obj.likesNumber);
	});

	SOCKET.on('server: unlike message', (obj) => {
		uiManager.updateLike(obj.messageId, obj.likesNumber);
	});
});