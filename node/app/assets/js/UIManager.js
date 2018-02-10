$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;

	let notificationsCounter = 0;

	function UIManager() {}

	UIManager.prototype.addNotification = function(_type, text, _className) {
		const className = _className || 'alert-light';
		const type = _type || '';
		const NOTIFICATION_ID = 'notification-' + notificationCoutner;

		notificationsCounter += 1;

		$(CONSTS.NOTIFICATIONS_WRAPPER.id).prepend(
			'<div id="' + NOTIFICATION_ID + '" class="alert ' + className + ' alert-dismissible fade show" role="alert">' +
			  '<strong>' + type + '</strong> ' + text +
			  '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
			    '<span aria-hidden="true">&times;</span>' +
			  '</button>' +
			'</div>'
		);

		setTimeout(() => {
			$('#' + NOTIFICATION_ID).alert('close');
		}, 3000);

		return this;
	}

	UIManager.prototype.getLabel = function(label) {
		switch (label) {
			case 'валентинка': return { text: 'favourite_border', className: 'text-danger' };
			case 'секрет': return { text: 'hearing', className: 'text-info' };
			case 'шутка': return { text: 'mood', className: 'text-warning' };
			case 'гадость': return { text: 'gesture', className: 'text-success' };
			case 'идея': return { text: 'lightbulb_outline', className: 'text-warning' };
			default: return { text: 'more_horiz', lassName: 'text-secondary' };
		}
	}

	UIManager.prototype.prependMessage = function(data) {
		const FROM = data.from.length > 0 ? ' от ' + data.from : '';
		const TO = data.to;
		const MESSAGE = data.message;
		const LABEL = this.getLabel(data.label.toLowerCase());
		const ID = data._id;

		$(CONSTS.MESSAGES_CONTAINER).prepend(
			'<div id="' + ID + '" class="message">' +
				'<div class="message__icon-container">' +
					'<i class="material-icons ' + LABEL.className + '">' + LABEL.text + '</i>' +
				'</div>' +
				'<div class="message__content">' +
					'<div class="message__header">' +
						'<span class="font-weight-bold message__title">' + TO + FROM + '</span>' +
					'</div>' +
					'<div class="message__text text-muted">' + MESSAGE + '</div>' +
				'</div>' +
			'</div>'
		);

		return this;
	};

	UIManager.prototype.appendMessage = function(data) {
		const FROM = data.from.length > 0 ? ' от ' + data.from : '';
		const TO = data.to;
		const MESSAGE = data.message;
		const LABEL = this.getLabel(data.label.toLowerCase());
		const ID = data._id;

		$(CONSTS.MESSAGES_CONTAINER).prepend(
			'<div id="' + ID + '" class="message">' +
				'<div class="message__icon-container">' +
					'<i class="material-icons ' + LABEL.className + '">' + LABEL.text + '</i>' +
				'</div>' +
				'<div class="message__content">' +
					'<div class="message__header">' +
						'<span class="font-weight-bold message__title">' + TO + FROM + '</span>' +
					'</div>' +
					'<div class="message__text text-muted">' + MESSAGE + '</div>' +
				'</div>' +
			'</div>'
		);

		return this;
	};

	UIManager.prototype.extendCanvas = function(height) {
		CONSTS.APP.CONSTS.CANVAS.height = height;

		return this;
	};

	UIManager.prototype.makeSubmitBtnWaiting = function() {
		$('#' + CONSTS.SUBMIT_BUTTON).attr('disabled', true).text('. . .');
		return this;
	};

	UIManager.prototype.resetSubmitBtn = function() {
		$('#' + CONSTS.SUBMIT_BUTTON).attr('disabled', false).text('Отправить');
		return this;
	};

	UIManager.prototype.clearForm = function() {
		CONSTS.FROM_INPUT.value = '';
		CONSTS.TO_INPUT.value = '';
		CONSTS.MESSAGE_INPUT = '';
		CONSTS.LABEL_SELECT = 'Валентинка';
		CONSTS.SPEAKER_SELECT = 'Алиса';

		return this;
	};

	UIManager.prototype.showInvisibleMode = function() {
		CONSTS.INVISIBILITY_BUTTON.innerHTML = 'visibility_off';

		CONSTS.FROM_INPUT.style = 'color: transparent';
		CONSTS.TO_INPUT.style = 'color: transparent';
		CONSTS.MESSAGE_INPUT.style = 'color: transparent';
		CONSTS.LABEL_SELECT.style = 'color: transparent';
		CONSTS.SPEAKER_SELECT.style = 'color: transparent';
	};

	UIManager.prototype.showVisibleMode = function() {
		CONSTS.INVISIBILITY_BUTTON.innerHTML = 'visibility';

		CONSTS.FROM_INPUT.style = 'color: #495057';
		CONSTS.TO_INPUT.style = 'color: #495057';
		CONSTS.MESSAGE_INPUT.style = 'color: #495057';
		CONSTS.LABEL_SELECT.style = 'color: #495057';
		CONSTS.SPEAKER_SELECT.style = 'color: #495057';
	};

	UIManager.prototype.addLikedClassToMessage = function(id) {
		$('#' + id).find('.message__like-amount').addClass('message__like-amount--liked');
		$('#' + id).find('.message__like-heart').addClass('message__like-heart--liked');
	};

	UIManager.prototype.removeLikedClassFromMessage = function(id) {
		$('#' + id).find('.message__like-amount').removeClass('message__like-amount--liked');
		$('#' + id).find('.message__like-heart').removeClass('message__like-heart--liked');
	};

	UIManager.prototype.setMessageRemainder = function(number) {
		CONSTS.REMAINDER_CONTAINER.innerHTML = number;

		if (number === 0) {
			$('#' + COSNTS.REMAINDER_CONTAINER.id).addClass('text-danger');
		} else {
			$('#' + COSNTS.REMAINDER_CONTAINER.id).removeClass('text-danger');
		}
	};

	UIManager.prototype.resetMessageRemainder = function() {
		CONSTS.REMAINDER_CONTAINER.innerHTML = '100';

		$('#' + COSNTS.REMAINDER_CONTAINER.id).removeClass('text-danger');
	};

	window.APP.CONSTRUCTORS = window.APP.CONSTRUCTORS || {};

	window.APP.CONSTRUCTORS.UIManager = UIManager;
});
