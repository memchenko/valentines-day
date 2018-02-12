$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;
	const SOCKET = CONSTS.PAINTINGS_SOCKET;

	if (CONSTS.WINDOW_WIDTH < 960) return;

	const uiManager = new window.APP.CONSTRUCTORS.UIManager();

	let CANVAS = CONSTS.CANVAS;
	let CTX = CANVAS.getContext('2d');

	const CANVAS_COORDS = CONSTS.CANVAS.getBoundingClientRect();
	const MOUSE = { x: 0, y: 0 };

	const SHAPE = {
		color: '',
		coords: []
	};

	let isPaintingMode = false;
	let isLoadingShapes = false;

	fetch(CONSTS.API_PAINTINGS, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache'
		})
		.then(res => {
			if (res.status >= 400) throw new Error('Не удалось загрузить рисунки');

			return res.json();
		})
		.then((json) => {
			isLoadingShapes = true;

			uiManager.setCanvasHeight(+json.height);

			json.paintings.forEach((shape) => {
				CTX.lineWidth = 3;
				CTX.lineJoin = 'round';
				CTX.lineCap = 'round';
				CTX.strokeStyle = shape.color;
				CTX.beginPath();
			    CTX.moveTo(shape.coords[0].x, shape.coords[0].y);

			    shape.coords.forEach((coords, i) => {
			    	if (i === 0) return;
			    	CTX.lineTo(coords.x, coords.y);
			    	CTX.stroke();
			    });
			});
		    
		    isLoadingShapes = false;
		})
		.catch((err) => {
			uiManager.addNotification('Ошибка', err.message, 'alert-danger');
		});

	function paint(CTX) {
	    CTX.lineTo(MOUSE.x, MOUSE.y);
	    CTX.stroke();
	};

	function updateCoords(e) {
		MOUSE.x = e.clientX + 4 - CANVAS_COORDS.x;
	    MOUSE.y = e.clientY + 25 - CANVAS_COORDS.y;

	    SHAPE.coords.push({ x: MOUSE.x, y: MOUSE.y });
	}
	 
	function assignMouseDown(CANVAS, CTX) {
		return function(e) {
			isPaintingMode = true;

			updateCoords(e);

			SHAPE.color = CONSTS.PALETTE.value;

			CTX = CANVAS.getContext('2d');

			CTX.lineWidth = 3;
			CTX.lineJoin = 'round';
			CTX.lineCap = 'round';
		    CTX.beginPath();
			CTX.strokeStyle = SHAPE.color;
		    CTX.moveTo(MOUSE.x, MOUSE.y);
		};
	}

	function assignMouseMove(CTX) {
		return function(e) {
			if (!isPaintingMode) return;
			if (isLoadingShapes) return;

		    updateCoords(e);
		    paint(CTX);
		};
	}

	function finishPainting() {
		if (isPaintingMode) {
	    	SOCKET.emit('client: put shape', SHAPE);
	    	isPaintingMode = false;

	    	SHAPE.color = '';
	    	SHAPE.coords = [];

    		CTX = null;
    	}
	}

	CANVAS.addEventListener('mousemove', assignMouseMove(CTX), false);
	CANVAS.addEventListener('mousedown', assignMouseDown(CANVAS, CTX), false);
	CANVAS.addEventListener('mouseup', finishPainting, false);
	CANVAS.addEventListener('mouseleave', finishPainting, false);
	 
	SOCKET.on('server: new shape', (data) => {
		finishPainting();

		CTX = CANVAS.getContext('2d');
		CTX.lineWidth = 3;
		CTX.lineJoin = 'round';
		CTX.lineCap = 'round';
		CTX.beginPath();
		CTX.strokeStyle = data.color;
	    CTX.moveTo(data.coords[0].x, data.coords[0].y);

	    data.coords.forEach((coords, i) => {
	    	if (i === 0) return;
	    	CTX.lineTo(coords.x, coords.y);
	    	CTX.stroke();
	    });

	    CTX = null;
	});

	function onAddSpace() {
		uiManager.makeAddSpaceBtnWaiting();
		SOCKET.emit('client: add space');
		$('#' + CONSTS.ADD_SPACE_BUTTON.id).unbind('click');
	}

	CONSTS.ADD_SPACE_BUTTON.addEventListener('click', onAddSpace);

	SOCKET.on('server: add space', (height) => {
		isLoadingShapes = true;

		fetch(CONSTS.API_PAINTINGS, {
			method: 'GET',
			mode: 'cors',
			cache: 'no-cache'
		})
		.then(res => {
			if (res.status >= 400) throw new Error('Не удалось загрузить рисунки');

			return res.json();
		})
		.then((json) => {
			isLoadingShapes = true;

			uiManager.rebuildCanvas().setCanvasHeight(height);
			CANVAS = CONSTS.CANVAS;
			CTX = CANVAS.getContext('2d');

			CANVAS.addEventListener('mousemove', assignMouseMove(CTX), false);
			CANVAS.addEventListener('mousedown', assignMouseDown(CANVAS, CTX), false);
			CANVAS.addEventListener('mouseup', finishPainting, false);
			CANVAS.addEventListener('mouseleave', finishPainting, false);

			json.paintings.forEach((shape) => {
				CTX.lineWidth = 3;
				CTX.lineJoin = 'round';
				CTX.lineCap = 'round';
				CTX.strokeStyle = shape.color;
				CTX.beginPath();
			    CTX.moveTo(shape.coords[0].x, shape.coords[0].y);

			    shape.coords.forEach((coords, i) => {
			    	if (i === 0) return;
			    	CTX.lineTo(coords.x, coords.y);
					CTX.stroke();
			    });

			});
			
			CTX = null;

			isLoadingShapes = false;
		})
		.catch((err) => {
			uiManager.addNotification('Ошибка', err.message, 'alert-danger');
		});
	});

	SOCKET.on('server: add space ok', () => {
		uiManager.resetAddSpaceBtn();
		CONSTS.ADD_SPACE_BUTTON.addEventListener('click', onAddSpace);
		uiManager.addNotification('Успех', 'вы успешно добавили пространство', 'alert-success');
	});

	SOCKET.on('server: add space error', () => {
		uiManager.resetAddSpaceBtn();
		CONSTS.ADD_SPACE_BUTTON.addEventListener('click', onAddSpace);
		uiManager.addNotification('Предупреждение', 'добавлять пространство можно только один раз!', 'alert-warning');
	});
});