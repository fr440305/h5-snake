/* Gluttonous Snake NEW-VERSION */
/* Weishu Tan */
/* 09142016 */

var GameMachine = {
	GluttonousSnake : {
		snake_shape : [],    //[RRRRCCCC(head), RRRRCCCC, ... , RRRRCCCC(tail)]
		food_position : 0,   //RRRRCCCC
		snake_status : 0x0100,    //including pause, direction, and score.000P DDDD SSSS SSSS;
		putFood : function () { "--------------------------------------------------------ALMOST_DONE(BUG NEED TO BE FIXED)!";
			//PARA - null;
			//RETN - BOOL;
			//DESP - set food_position randomly.
			var i;
			var food_rank = Math.floor(Math.random() * (100 - this.snake_shape.length));
			var snake_shape_array = [];
			for (i = 0; i < 100; i++)
				snake_shape_array[i] = 0;
			for (i = 0; i < this.snake_shape.length; i++) {
				snake_shape_array[((this.snake_shape[i] & 0xF0) >> 4) * 10 + (this.snake_shape[i] & 0xF)] = 1;
			}
			for (i = 0; i < food_rank; i++) {
				if (snake_shape_array[i] === 1) food_rank ++;
			}
			this.food_position = (food_rank % 10) + (Math.floor(food_rank / 10) << 4);
			return (true);
		},
		getInfo : function (context) { "--------------------------------------------------------DONE!";
			//PARA - context = {"foodposi"||"layout"||"pause"||"direction"||"score"};
			//RETN - what you get.
			//DESP - a query function.
			if (context === "layout") {
				var return_layout = [];
				for (var loop = 0; loop < this.snake_shape.length; loop ++) {
					var return_node = {row : undefined, col : undefined};
					return_node.row = (this.snake_shape[loop] & 0xF0) >> 4;
					return_node.col = (this.snake_shape[loop] & 0xF);
					return_layout.push(return_node);
				}
				return (return_layout);
			} else if (context === "direction") {
				return ( (this.snake_status & 0x0F00) >> 8 );
			} else if (context === "score") {
				return (this.snake_status & 0xFF);
			} else if (context === "foodposi") {
				var return_position = {row : undefined, col : undefined};
				return_position.row = (this.food_position & 0xF0) >> 4;
				return_position.col = (this.food_position & 0xF);
				return (return_position);
			} else if (context === "pause") {
				return ((this.snake_status & 0xF000) === 0) ? false : true;
			}
		},
		changeSnakeDirection : function (new_direction) { "------------------------------------------ALMOST_DONE!";
			//PARA - number::new_direction = {1000b||0100b||0010b||0001b};
			//PARA - DESP - 1000b = left, 0100b = down, 0010b = up, 0001b = right;
			//RETN - bool = {true || false};
			//DESP - if we can change, return true. Otherwise return false.
			var current_snake_direction = this.getInfo("direction");
			if (new_direction === 8 || new_direction === 1) {
				/*left or right*/
				if (current_snake_direction !== 8 && current_snake_direction !== 1) {
					/*okay*/
					this.snake_status = (this.snake_status & 0xF0FF) | (new_direction << 8);
					return (true);
				}
			} else if (new_direction === 2 || new_direction === 4) {
				/*up or down */
				if (current_snake_direction !== 2 && current_snake_direction !== 4) {
					/*okay*/
					this.snake_status = (this.snake_status & 0xF0FF) | (new_direction << 8);
					return (true);
				}
			}
			/* should use bit-operation to simplifly the code.*/
			return (false);
		},
		snakeBorn : function () { "---------------------------------------------------------------------DONE!";
			//PARA - null,
			//RETN - BOOL ; usually be true;
			//DESP - initial the snake, including it's shape and it's status;
			/* (3,3), (3,4), (3,5), (3,6) */
			this.snake_status = 0x0100;
			this.snake_shape = [];
			for (var i = 6; i >= 3; i--) 
				this.snake_shape.push( (3<<4) + i );
			this.putFood();
			return (true);
		},
		setSnakePause : function () {
			/*PARA - null*/
			/*RETN - null*/
			/*DESP - pause or active the snake.*/
			if ((this.snake_status & 0xF000) === 0) {
				this.snake_status += (1 << 12);
				return (true); // paused.
			} else {
				this.snake_status = this.snake_status & 0x0FFF;
				return (false); // restarted.
			}
		},
		snakeMove : function () { "---------------------------------------------------------------------DONE!";
			//PARA - null,
			//RETN - number = {001b || 000b};
			//RETN - DESP - 1 = normal, 0 = dead;
			//DESP - move the whole snake according the status::direction;
			// check if snake died:
			for (var loop = 1; loop < this.snake_shape.length; loop++) {
				if (this.snake_shape[loop] === this.snake_shape[0])
					return (0);  /*dead*/
			}
			//cheak if snake is paused:
			if (this.getInfo("pause") === true)
				return (1);
			//If not, move!
			var snake_direction = this.getInfo("direction");
			var current_head = this.snake_shape[0];
			var new_head;
			if (snake_direction === 8) {
				/*left*/
				if ((current_head & 0xF) > 0) {
					new_head = current_head - 1;
				} else {
					new_head = (current_head & 0xF0) + 9;
				}
			} else if (snake_direction === 4) {
				/*down*/
				if (((current_head & 0xF0)>>4) < 9) {
					new_head = current_head + 0x10;
				} else {
					new_head = current_head & 0xF;
				}
			} else if (snake_direction === 2) {
				/*up*/
				if (((current_head & 0xF0)>>4) > 0) {
					/* more elegent solution is needed...*/ /*maybe can use bit-or.*/
					var new_row = ((current_head & 0xF0) >> 4) - 1;
					var new_col = current_head & 0xF;
					new_head = (new_row << 4) + new_col;
				} else {
					new_head = (current_head & 0xF) + (9 << 4);
				}
			} else if (snake_direction === 1) {
				/*right*/
				if ((current_head & 0xF) < 9) {
					new_head = current_head + 1;
				} else {
					new_head = current_head & 0xF0;
				}
			}
			this.snake_shape.unshift (new_head);
			// check if snake eat food:
			if (this.snake_shape[0] !== this.food_position) {
				this.snake_shape.pop();
			} else {
				this.putFood();
				this.snake_status ++;
			}
			return (1); /*normal*/
		}
	},
	difficulty : 5,
	game_timer_id : undefined,
	gameInitor : function (this_class_name) { "-------------------------------------------------------------------------DONE!";
		if (this.game_timer_id !== undefined) {
			clearInterval(this.game_timer_id);
			this.game_timer_id = undefined;
		}
		this.GluttonousSnake.snakeBorn();
		/* here can be more robboned .*/
		this.game_timer_id = setInterval("GameMachine.gameIterator()", 1000 / this.difficulty);
		if (_Start_ !== undefined ) {
			_Start_.innerHTML = "<br/>If you wanna pause, click the grid.";
		}
		return (0);
	},
	gameIterator : function () { "------------------------------------------------------------------------DONE!";
		var that = this.GluttonousSnake;
		if (that.snakeMove() === 0) this.gameDestructor();
		this.layoutEngine (that.getInfo("layout"), that.getInfo("score"), that.getInfo("foodposi"));
	},
	gameDestructor : function () {
		//will be called iff the snake is dead.
		if (this.game_timer_id !== undefined) {
			clearInterval(this.game_timer_id);
			this.game_timer_id = undefined;
		}
		if (_Start_ !== undefined) {
			_Start_.innerHTML = "<br/>Oh! you died!<br/>Click me or press Enter to restart, or go down for this page to see more...";
		}
		return (0);
	},
	eventChangeDirection : function (new_direction) {
		/*PARA - new_direction = {1000||0100||0010||0001}
		**     - Myself = this class*/
		/*RETN - none*/
		/*DESP - change the direction of the snake. this
		**     - function only can be called by 
		**     - presentation layer.*/
		return (this.GluttonousSnake.changeSnakeDirection (new_direction));
	},
	eventKeyDown : function (e) {
		/*PARA - e : the event class of this windows. 
		**RETN - none.
		**DESP - only can be called when keydown.*/
		var key_map = {
			/*H*/72: 8,
			/*J*/74: 4,
			/*K*/75: 2,
			/*L*/76: 1,
			/*W*/87: 2,
			/*A*/65: 8,
			/*S*/83: 4,
			/*D*/68: 1,
		};
		e = e || window.event;
		e = e.keyCode || e.which;
		if (e === 32) {
			this.eventPause();
		} else if (e === 13) {
			//console.log(this.game_timer_id);
			this.gameInitor();
			return (0);
		} else {
			this.eventChangeDirection(key_map[e.toString()]);
			//GameMachine.GluttonousSnake.changeSnakeDirection(key_map[e.toString()]);
		}
	},
	eventPause : function () {
		if (_Start_ === undefined) throw ("document element -_Start_- doesn't exist!");
		var status = this.GluttonousSnake.setSnakePause ();
		if (status === true) {
			_Start_.innerHTML = "<br/>if you wanna restart the snake, click the grid again.";
		} else {
			_Start_.innerHTML = "<br/>If you wanna pause, click the grid.";
		}
	},
	layoutEngine : function (snake_shape, snake_score, food_position) { "--------------------------------------------DONE!";
		/* draw snake_shape */
		if (_SnakeContainer_ === undefined) return (false);
		for (var i = 0; i <= 9; i++) {
			for (var j = 0; j <= 9; j++) {
				_SnakeContainer_.rows[i].cells[j].style.backgroundColor = "#00f";
				_SnakeContainer_.rows[i].cells[j].innerHTML = "";
			}
		}
		for (var loop = 0; loop < snake_shape.length; loop ++) {
			_SnakeContainer_.rows[snake_shape[loop].row].cells[snake_shape[loop].col].style.backgroundColor = "#f00";
		}
		_SnakeContainer_.rows[snake_shape[0].row].cells[snake_shape[0].col].innerHTML = snake_score.toString();
		_SnakeContainer_.rows[food_position.row].cells[food_position.col].style.backgroundColor = "#0f0";
	}
};
