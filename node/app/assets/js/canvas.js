$(document).ready(() => {
	const CONSTS = window.APP.CONSTS;

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

	function paint() {
	    CTX.lineTo(MOUSE.x, MOUSE.y);
	    CTX.stroke();
	};

	function updateCoords(e) {
		MOUSE.x = e.clientX - CANVAS_COORDS.x;
	    MOUSE.y = e.clientY + 20 - CANVAS_COORDS.y;

	    SHAPE.coords.push({ x: MOUSE.x, y: MOUSE.y });
	}

	CANVAS.addEventListener('mousemove', function(e) {
		if (!isPaintingMode) return;
		if (isLoadingShapes) {
			CONSTS.SOCKET.emit('client: coords', SHAPE);
			return;
		}

	    updateCoords(e);

	    paint();
	});
	 
	CANVAS.addEventListener('mousedown', function(e) {
		isPaintingMode = true;

		updateCoords(e);

		SHAPE.color = CONSTS.PALETTE.value;
		CTX.strokeStyle = SHAPE.color;
	    CTX.beginPath();
	    CTX.moveTo(MOUSE.x, MOUSE.y);
	});
	 
	CANVAS.addEventListener('mouseup', function() {
	    isPaintingMode = false;

	    CONSTS.SOCKET.emit('client: coords', SHAPE);
	});

	CANVAS.addEventListener('mouseleave', function() {
	    isPaintingMode = false;

	    CONSTS.SOCKET.emit('client: coords', SHAPE);
	});
	 
	CONSTS.SOCKET.on('server: coords', (data) => {
		CTX.strokeStyle = data.color;
		CTX.beginPath();
	    CTX.moveTo(data.coords[0].x, data.coords[0].y);

	    data.coords.forEach((coords, i) => {
	    	if (i === 0) return;
	    	CTX.lineTo(coords.x, coords.y);
	    	CTX.stroke();
	    });	
	});

	CONST.ADD_SPACE_BUTTON.addEventListener('click', () => {
		CONSTS.SOCKET.emit('client: add space');
	});

	CONSTS.SOCKET.on('server: add space', () => {
		isLoadingShapes = true;

		uiManager.extendCanvas(100);

		fetch('', {
			mode: 'GET'
		})
		.then(res => {
			if (res.status !== 200) throw new Error('Не могу загрузить рисунки');

			return res.json();
		})
		.then((json) => {
			json.forEach((shape) => {
				CTX.strokeStyle = shape.color;
				CTX.beginPath();
			    CTX.moveTo(shape.coords[0].x, shape.coords[0].y);

			    shape.coords.forEach((coords, i) => {
			    	if (i === 0) return;
			    	CTX.lineTo(coords.x, coords.y);
			    	CTX.stroke();
			    });
			});
		})
		.cath((err) => {
			uiManager.addNotification('Ошибка', err.message, 'alert-danger');
		});
	});

	CONSTS.SOCKET.on('server: add space error', () => {
		uiManager.addNotification('Предупреждение', 'добавлять пространство можно только один раз!', 'alert-warning');
	});
});