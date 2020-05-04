'use strict';

var mousePosition;
var offset = [0, 0];
var div;
var isDown = false;
var parentWidth = document.getElementById('editor').offsetWidth;
var parentHeight = document.getElementById('editor').offsetHeight;
var boxWidth = 100;
var boxHeight = 100;

div = document.createElement('div');
div.style.position = 'absolute';
div.style.left = '0px';
div.style.top = '0px';
div.style.width = boxWidth + 'px';
div.style.height = boxHeight + 'px';
div.style.background = 'red';
div.style.color = 'blue';

document.getElementById('editor').appendChild(div);

div.addEventListener(
	'mousedown',
	function (e) {
		isDown = true;
		offset = [div.offsetLeft - e.clientX, div.offsetTop - e.clientY];
	},
	true
);

document.addEventListener(
	'mouseup',
	function () {
		isDown = false;
	},
	true
);

document.addEventListener(
	'mousemove',
	function (event) {
		event.preventDefault();
		if (isDown) {
			mousePosition = {
				x: event.clientX,
				y: event.clientY,
			};
			var newLeft = mousePosition.x + offset[0];
			var newTop = mousePosition.y + offset[1];
			if (newLeft < parentWidth - boxWidth && newLeft > 0) div.style.left = newLeft + 'px';
			if (newTop < parentHeight - boxHeight && newTop > 0) div.style.top = newTop + 'px';

			// div.style.top  =  newTop  + 'px';
		}
	},
	true
);
