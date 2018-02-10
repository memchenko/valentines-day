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

	
});