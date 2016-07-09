/*
	snake.js
	author : Firerain;
	Start-date : Mar 3, 2016;
*/

/* define the objent */
var snake = new Object();
var food = new Object();              
var output = new Object();            /* to display the outline like snake. */
var EventProcessor = new Object();    /* to process the event from custumer */
/* On Object::EventProcessor */
EventProcessor.KbodClicked = function (direction) {
	/* Kbod refers to 'KeyBoard Of Direction.'*/
	snake.direction = direction;
}
EventProcessor.bodyKeydown = function (e) {
	/* e refers to event. */
	/* here should be hacking! */
	var keynum = e.which;
	if (keynum === 74) {
		/* 74 refers to 'j' */
		snake.direction = "down";
	} else if (keynum === 75) {
		/* 75 refers to 'k' */
		snake.direction = "up";
	} else if (keynum === 76) {
		/* 76 refers to 'l' */
		snake.direction = "right";
	} else if (keynum === 72) {
		/* 72 refers to 'h' */
		snake.direction = "left";
	}
}
/* On Object::snake */
snake.direction = "right";
snake.body = new Array();
/*
	snake.body[0] : row of head;
	snake.body[1] : col of head;
	snake.body[snake.body.length - 1] : row of tail;
	snake.body[snake.body.length] : col of tail;
	snake.body[2n] : the row of the nth bodyblock of the snake;
	snake.body[2n+1] : the column of the nth bodyblock of the snake;
	snake."bodyNumber" = snake.body.length / 2;
*/
snake.initialize = function () {
	food.setP();
	snake.body.push(3, 6);
	snake.body.push(3, 5);
	snake.body.push(3, 4);
	snake.body.push(3, 3);
}
snake.move = function () { 
	var headRow, headCol;
	/* calculate the row and column of the new head of the snake */
	headRow = snake.body[0];
	headCol = snake.body[1];
	if (snake.direction === "up") {
		headRow --;
	} else if (snake.direction === "down") {
		headRow ++;
	} else if (snake.direction === "left") {
		headCol --;
	} else if (snake.direction === "right") {
		headCol ++;
	}
	/* insert the new head of the snake */
	snake.body.splice(0, 0, headCol);
	snake.body.splice(0, 0, headRow);
	/* del the tail of the snake */
	/* verify if the snake eat the food */
	if (headRow === food.pRow && headCol === food.pCol) {
		food.setP();
	} else {
		snake.body.pop();
		snake.body.pop();
	}
}
snake.deadOrnot = function () {
	var index; 
	var headRow = snake.body[0];
	var headCol = snake.body[1];
	if (headRow < 0 || headCol < 0 || headRow > 9 || headCol > 9) {
		return true;
	} 
	/* verify if the snake 'eat himself' */
	for (index = 2; index < snake.body.length; index = index + 2 ) {
		if (snake.body[index] === headRow && snake.body[index + 1] === headCol ) {
			return true;
		}
	}
	return false;
}
snake.winOrnot = function () {
	if (snake.body.length === 200) {
		return true;
	} else {
		return false;
	}
}
/* On Object::food */
food.pRow = undefined;
food.pCol = undefined;
food.possiblePosition = new Array();
food.getPossiblePosition = function () {
	/* more elegent solution was needed. */
	var row, col;
	var index;
	var occupiedOrnot;
	/* overview each cell in the playground */
	food.possiblePosition = [];
	for (row = 0; row < 10; row++ ) {
		for (col = 0; col < 10; col++) {
			/* verify if the cell in playground[row][col]
			** was occupied with the bodyblock of the snake */
			occupiedOrnot = false;
			for (index = 0; index < snake.body.length; index = index + 2) {
				if (row === snake.body[index] && col === snake.body[index + 1]) {
					occupiedOrnot = true;
					break;
				}
			}
			if (occupiedOrnot === false) {
				/* here should be false, be true if for testing. */
				food.possiblePosition.push(row, col);
			}
		}
	}
}
food.setP = function () {
	/* this function should be ran after food.getPossiblePosition() was ran. */
	food.getPossiblePosition();
	var pointer = Math.round(Math.random() * (food.possiblePosition.length / 2)) * 2;
	food.pRow = food.possiblePosition[pointer];
	food.pCol = food.possiblePosition[pointer + 1];
}
/* On Object::output */
output.creatPlayground = function () {
	var playground = document.getElementById("playground");
	var cell, row;
	var tablec, tabler;
	for (row = 0; row <= 9; row ++) {
		tabler = playground.insertRow(row);
		for (cell = 0; cell <= 9; cell ++) {
			tablec = tabler.insertCell(cell);
			//tablec.innerHTML = "&nbsp;";
			tablec.style.width = "30px";
			tablec.style.height = "30px";
		}
	}
	//output.alg();
}
output.alg = function () {
/*alg refers to align */
	var playground = document.getElementById('playground');
	var bdy = document.getElementById('bdy');
	var W0 = bdy.clientWidth;
	var H0 = bdy.clientHeight;
	playground.style.width = 2 * W0 / 3;
	playground.style.height = 2 * H0 / 3;
	playground.style.left = W0 / 6; 
}
output.printPlayground = function () {
	var index;
	var playground = document.getElementById("playground");
	var row, cell;
	/* print the space */
	for (row = 0; row <= 9; row++) {
		for(cell = 0; cell <= 9; cell++) {
			//playground.rows[row].cells[cell].innerHTML = "&nbsp;";
			playground.rows[row].cells[cell].style.backgroundColor = "rgb(232, 232, 232)";
		}
	}
	/* print the snake */
	for (index = 0; index < snake.body.length; index = index + 2 ) {
		row = snake.body[index];
		cell = snake.body[index + 1];
		//playground.rows[row].cells[cell].innerHTML = "+";
		playground.rows[row].cells[cell].style.backgroundColor = "rgb(0, 0, 0)";;
	}
	/* print the food */
	row = food.pRow;
	cell = food.pCol;
	//playground.rows[row].cells[cell].innerHTML = "#";
	playground.rows[row].cells[cell].style.backgroundColor = "rgb(0, 0, 256)";;
}
function mainLoop() {
	snake.move();
	if (snake.winOrnot() === true) {
		alert ("U - win!");
		clearTimeout(Timer);
		return undefined;
	}
	if (snake.deadOrnot() === true) {
		alert("U - dead!");
		clearTimeout(Timer);
		return undefined;
	}
	output.printPlayground();
	Timer = setTimeout("mainLoop()", 500);
	/* with the time gap */
}
/* Game...Start! */
var Timer;
snake.initialize();
output.creatPlayground();
mainLoop();
