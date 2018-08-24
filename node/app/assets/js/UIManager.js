$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;

	let notificationsCounter = 0;

	function UIManager() {}

	UIManager.prototype.addNotification = function(_type, text, _className) {
		const className = _className || 'alert-light';
		const type = _type || '';
		const NOTIFICATION_ID = 'notification-' + notificationsCounter;

		notificationsCounter += 1;

		$('#' + CONSTS.NOTIFICATIONS_WRAPPER.id).prepend(
			'<div id="' + NOTIFICATION_ID + '" class="alert ' + className + ' alert-dismissible fade show" role="alert">' +
			  '<strong>' + type + ':</strong> ' + text +
			  '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
			    '<span aria-hidden="true">&times;</span>' +
			  '</button>' +
			'</div>'
		);

		setTimeout(() => {
			$('#' + NOTIFICATION_ID).alert('close');
		}, 3000);

		return this;
	};

	UIManager.prototype.getLabel = function(label) {
		switch (label) {
			case 'валентинка': return { text: 'favorite', className: 'text-danger' };
			case 'секрет': return { text: 'hearing', className: 'text-info' };
			case 'шутка': return { text: 'mood', className: 'text-warning' };
			case 'гадость': return { text: 'gesture', className: 'text-success' };
			case 'идея': return { text: 'lightbulb_outline', className: 'text-warning' };
			default: return { text: 'more_horiz', lassName: 'text-secondary' };
		}
	};

	UIManager.prototype.updateLike = function(messageId, number) {
		$('#' + messageId).find('.message__like-amount').text(number);
	};

	UIManager.prototype.prependMessage = function(data) {
		const FROM = data.from !== 'N/A' ? ' от ' + data.from : '';
		const TO = data.to;
		const MESSAGE = data.message;
		const LABEL = this.getLabel(data.label.toLowerCase());
		const ID = data['_id'];
<<<<<<< HEAD
=======

		CONSTS.MESSAGES_NUMBER += 1;
>>>>>>> 5626fef829f0d2e6f5c67f9d8f0d28718b17b63d

		$('#' + CONSTS.MESSAGES_CONTAINER.id).prepend(
			'<div id="' + ID + '" class="message message--new">' +
				'<div class="message__icon-container">' +
					'<i class="material-icons ' + LABEL.className + '">' + LABEL.text + '</i>' +
				'</div>' +
				'<div class="message__content">' +
					'<div class="message__header">' +
						'<span class="font-weight-bold message__title">' + TO + FROM + '</span>' +
					'</div>' +
					'<div class="message__text text-muted">' + MESSAGE + '</div>' +
				'</div>'  +
				'<button class="message__like-btn">' +
					'<span class="message__like-amount">' + data.likedIPs.length + '</span>' +
					'<i class="material-icons message__like-heart">favorite</i>' +
				'</button>' +
			'</div>'
		);

		let isLiked = data.isLiked;

		if (isLiked) {
			$('#' + ID).find('.message__like-amount').addClass('message__like-amount--liked');
			$('#' + ID).find('.message__like-heart').addClass('message__like-heart--liked');
		}

		$('#' + ID).click(() => {
			if (isLiked) {
				isLiked = false;
				$('#' + ID).find('.message__like-amount').removeClass('message__like-amount--liked');
				$('#' + ID).find('.message__like-heart').removeClass('message__like-heart--liked');
				CONSTS.MESSAGES_SOCKET.emit('client: unlike message', ID);
			} else {
				isLiked = true;
				$('#' + ID).find('.message__like-amount').addClass('message__like-amount--liked');
				$('#' + ID).find('.message__like-heart').addClass('message__like-heart--liked');
				CONSTS.MESSAGES_SOCKET.emit('client: like message', ID);
			}
		});

		setTimeout(() => {
			$('#' + ID).removeClass('message--new');
		}, 500);		

		return this;
	};

	UIManager.prototype.appendMessage = function(data) {
		const FROM = data.from !== 'N/A' ? ' от ' + data.from : '';
		const LABEL = this.getLabel(data.label.toLowerCase());
		const ID = data['_id'];
<<<<<<< HEAD
=======

		CONSTS.MESSAGES_NUMBER += 1;
>>>>>>> 5626fef829f0d2e6f5c67f9d8f0d28718b17b63d

		$('#' + CONSTS.MESSAGES_CONTAINER.id).append(
			'<div id="' + ID + '" class="message message--new">' +
				'<div class="message__icon-container">' +
					'<i class="material-icons ' + LABEL.className + '">' + LABEL.text + '</i>' +
				'</div>' +
				'<div class="message__content">' +
					'<div class="message__header">' +
						'<span class="font-weight-bold message__title">' + data.to + FROM + '</span>' +
					'</div>' +
					'<div class="message__text text-muted">' + data.message + '</div>' +
				'</div>' +
				'<button class="message__like-btn">' +
					'<span class="message__like-amount">' + data.likedIPs.length + '</span>' +
					'<i class="material-icons message__like-heart">favorite</i>' +
				'</button>' +
			'</div>'
		);

		let isLiked = data.isLiked;

		if (isLiked) {
			$('#' + ID).find('.message__like-amount').addClass('message__like-amount--liked');
			$('#' + ID).find('.message__like-heart').addClass('message__like-heart--liked');
		}

		$('#' + ID).click(() => {
			if (isLiked) {
				isLiked = false;
				$('#' + ID).find('.message__like-amount').removeClass('message__like-amount--liked');
				$('#' + ID).find('.message__like-heart').removeClass('message__like-heart--liked');
				CONSTS.MESSAGES_SOCKET.emit('client: unlike message', ID);
			} else {
				isLiked = true;
				$('#' + ID).find('.message__like-amount').addClass('message__like-amount--liked');
				$('#' + ID).find('.message__like-heart').addClass('message__like-heart--liked');
				CONSTS.MESSAGES_SOCKET.emit('client: like message', ID);
			}
		});

		setTimeout(() => {
			$('#' + ID).removeClass('message--new');
		}, 500);

		return this;
	};

	UIManager.prototype.rebuildCanvas = function() {
		$('#' + CONSTS.CANVAS.id).remove();
		$('#' + CONSTS.CANVAS_WRAPPER.id).prepend(
			'<canvas width="600" height="0" class="canvas" id="canvas"></canvas>'	
		);

		CONSTS.CANVAS = document.querySelector('#canvas');

		return this;
	};

	UIManager.prototype.setCanvasHeight = function(height) {
		CONSTS.CANVAS.height = height;

		return this;
	};

	UIManager.prototype.makeSubmitBtnWaiting = function() {
		$('#' + CONSTS.SUBMIT_BUTTON.id).attr('disabled', true).text('. . .');
		return this;
	};

	UIManager.prototype.resetSubmitBtn = function() {
		$('#' + CONSTS.SUBMIT_BUTTON.id).attr('disabled', false).text('Отправить');
		return this;
	};

	UIManager.prototype.clearForm = function() {
		CONSTS.FROM_INPUT.value = '';
		CONSTS.TO_INPUT.value = '';
		CONSTS.MESSAGE_INPUT.value = '';
		CONSTS.LABEL_SELECT.value = 'Валентинка';
		CONSTS.SPEAKER_SELECT.value = 'alyss';

		return this;
	};

	UIManager.prototype.showInvisibleMode = function() {
		$('#' + CONSTS.INVISIBILITY_BUTTON.id).find('i').text('visibility_off');

		CONSTS.FROM_INPUT.style = 'color: transparent';
		CONSTS.TO_INPUT.style = 'color: transparent';
		CONSTS.MESSAGE_INPUT.style = 'color: transparent';
		CONSTS.LABEL_SELECT.style = 'color: transparent';
		CONSTS.SPEAKER_SELECT.style = 'color: transparent';

		return this;
	};

	UIManager.prototype.showVisibleMode = function() {
		$('#' + CONSTS.INVISIBILITY_BUTTON.id).find('i').text('visibility');

		CONSTS.FROM_INPUT.style = 'color: #495057';
		CONSTS.TO_INPUT.style = 'color: #495057';
		CONSTS.MESSAGE_INPUT.style = 'color: #495057';
		CONSTS.LABEL_SELECT.style = 'color: #495057';
		CONSTS.SPEAKER_SELECT.style = 'color: #495057';

		return this;
	};

	UIManager.prototype.addLikedClassToMessage = function(id) {
		$('#' + id).find('.message__like-amount').addClass('message__like-amount--liked');
		$('#' + id).find('.message__like-heart').addClass('message__like-heart--liked');

		return this;
	};

	UIManager.prototype.removeLikedClassFromMessage = function(id) {
		$('#' + id).find('.message__like-amount').removeClass('message__like-amount--liked');
		$('#' + id).find('.message__like-heart').removeClass('message__like-heart--liked');

		return this;
	};

	UIManager.prototype.setMessageRemainder = function(number) {
		CONSTS.MESSAGE_REMAINDER_CONTAINER.innerHTML = number;

		if (number === 0) {
			$('#' + CONSTS.MESSAGE_REMAINDER_CONTAINER.id).addClass('text-danger');
		} else {
			$('#' + CONSTS.MESSAGE_REMAINDER_CONTAINER.id).removeClass('text-danger');
		}

		return this;
	};

	UIManager.prototype.setFromRemainder = function(number) {
		CONSTS.FROM_REMAINDER_CONTAINER.innerHTML = number;

		if (number === 0) {
			$('#' + CONSTS.FROM_REMAINDER_CONTAINER.id).addClass('text-danger');
		} else {
			$('#' + CONSTS.FROM_REMAINDER_CONTAINER.id).removeClass('text-danger');
		}

		return this;
	};

	UIManager.prototype.setToRemainder = function(number) {
		CONSTS.TO_REMAINDER_CONTAINER.innerHTML = number;

		if (number === 0) {
			$('#' + CONSTS.TO_REMAINDER_CONTAINER.id).addClass('text-danger');
		} else {
			$('#' + CONSTS.TO_REMAINDER_CONTAINER.id).removeClass('text-danger');
		}

		return this;
	};

	UIManager.prototype.resetMessageRemainder = function() {
		CONSTS.MESSAGE_REMAINDER_CONTAINER.innerHTML = '100';

		$('#' + CONSTS.MESSAGE_REMAINDER_CONTAINER.id).removeClass('text-danger');

		return this;
	};

	UIManager.prototype.resetFromRemainder = function() {
		CONSTS.FROM_REMAINDER_CONTAINER.innerHTML = '20';

		$('#' + CONSTS.FROM_REMAINDER_CONTAINER.id).removeClass('text-danger');

		return this;
	};

	UIManager.prototype.resetToRemainder = function() {
		CONSTS.TO_REMAINDER_CONTAINER.innerHTML = '20';

		$('#' + CONSTS.TO_REMAINDER_CONTAINER.id).removeClass('text-danger');

		return this;
	};

	UIManager.prototype.makeLoadMoreBtnWaiting = function() {
		$('#' + CONSTS.LOAD_MORE_BUTTON.id).attr('disabled', true).text('. . .');
		return this;
	};

	UIManager.prototype.makeLoadMoreBtnWaiting = function() {
		$('#' + CONSTS.LOAD_MORE_BUTTON.id).attr('disabled', false).text('Загрузить еще...');
		return this;
	};

	UIManager.prototype.makeAddSpaceBtnWaiting = function() {
		$('#' + CONSTS.ADD_SPACE_BUTTON.id).html('<span style="display: inline-block; margin-bottom: 9px">. . .</span>');
		return this;
	};

	UIManager.prototype.resetAddSpaceBtn = function() {
		$('#' + CONSTS.ADD_SPACE_BUTTON.id).html('<i class="material-icons add-space-btn__icon">add</i>');
		return this;
	};

	window.APP.CONSTRUCTORS = window.APP.CONSTRUCTORS || {};

	window.APP.CONSTRUCTORS.UIManager = UIManager;
});
