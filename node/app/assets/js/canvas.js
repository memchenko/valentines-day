$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;
	const SOCKET = CONSTS.PAINTINGS_SOCKET;

	if (CONSTS.WINDOW_WIDTH < 960) return;

	const uiManager = new window.APP.CONSTRUCTORS.UIManager();

	const CANVAS = CONSTS.CANVAS;
	const CTX = CANVAS.getContext('2d');

	const CANVAS_COORDS = CONSTS.CANVAS.getBoundingClientRect();
	const MOUSE = { x: 0, y: 0 };

	const SHAPE = {
		color: '',
		coords: []
	};

	let isPaintingMode = false;
	let isLoadingShapes = false;

	CTX.lineWidth = 3;
	CTX.lineJoin = 'round';
	CTX.lineCap = 'round';

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

	function paint() {
	    CTX.lineTo(MOUSE.x, MOUSE.y);
	    CTX.stroke();
	};

	function updateCoords(e) {
		MOUSE.x = e.clientX - CANVAS_COORDS.x;
	    MOUSE.y = e.clientY + 20 - CANVAS_COORDS.y;

	    SHAPE.coords.push({ x: MOUSE.x, y: MOUSE.y });
	}

	$('#' + CANVAS.id).mousemove(() => {
		console.log('i work move');
		if (!isPaintingMode) return;
		if (isLoadingShapes) return;

	    updateCoords(e);
	    paint();
	});

	$('#' + CANVAS.id).mousedown((e) => {
		console.log(e.target);
		isPaintingMode = true;

		updateCoords(e);

		SHAPE.color = CONSTS.PALETTE.value;
		CTX.strokeStyle = SHAPE.color;
	    CTX.beginPath();
	    CTX.moveTo(MOUSE.x, MOUSE.y);
	});
	 
	$('#' + CANVAS.id).mouseup(() => {
		console.log('i work 1');
	    if (isPaintingMode) {
	    	SOCKET.emit('client: put shape', SHAPE);
	    	isPaintingMode = false;
    	}
	});

	$('#' + CANVAS.id).mouseleave(() => {
		console.log('i work 2');
	    if (isPaintingMode) {
	    	SOCKET.emit('client: put shape', SHAPE);
			isPaintingMode = false;
		}
	});
	 
	SOCKET.on('server: new shape', (data) => {
		CTX.strokeStyle = data.color;
		CTX.beginPath();
	    CTX.moveTo(data.coords[0].x, data.coords[0].y);

	    data.coords.forEach((coords, i) => {
	    	if (i === 0) return;
	    	CTX.lineTo(coords.x, coords.y);
	    	CTX.stroke();
	    });
	});

	CONSTS.ADD_SPACE_BUTTON.addEventListener('click', () => {
		SOCKET.emit('client: add space');
	});

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

			uiManager.setCanvasHeight(height);

			json.paintings.forEach((shape) => {
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
		.cath((err) => {
			uiManager.addNotification('Ошибка', err.message, 'alert-danger');
		});
	});

	SOCKET.on('server: add space ok', () => {
		uiManager.addNotification('Успех', 'вы успешно добавили пространство', 'alert-success');
	});

	SOCKET.on('server: add space error', () => {
		uiManager.addNotification('Предупреждение', 'добавлять пространство можно только один раз!', 'alert-warning');
	});
});