/*=========================
     initialize game
=========================*/
var myApp = {
	initializeVars: function() {
		this.onOffVar = 'off';
		this.compSelection = [];
		this.userSelection = [];
		this.userTurn = false;
		this.newCompSelection = true;
		this.currentCount = 0;
		this.strictVar = -1;
		this.gameClockAction = 'stop';

	},
	initializeGame: function() {
		myApp.initializeVars();
		$(document).on('click', '.clickableButton', function() {
			myApp.value = $(this).attr('value');
			myApp.atrib = $(this).attr('atrib');
      console.log('###### On click button working ######');
      // console.log('value click ', myApp.value);
      // console.log('atrib click ', myApp.atrib);
      myApp.game.onOffFunc(myApp.value);
      myApp.game.startFunc(myApp.value);
      myApp.game.userSelectionFunc(myApp.value, myApp.atrib);
      myApp.game.strictFunc(myApp.value);

		});
	}
};
/* initialize game end*/

/*=========================
     Game logic
=========================*/
myApp.game = {
	onOffFunc: function(value) { // on off button
		console.log('onOffFunc');
		// on off blue button
		if (value === 'on') {
			console.log('on');
			$("#centerRow3OnOffBlue").css("float", 'right'); // shift blue button right
			$('#centerRow3OnOffBlue').attr('value', 'off');
			$("#countBoxText").text('--');
			myApp.onOffVar = 'on';
		}
		else if (value === 'off') {
			console.log('off');
			$("#centerRow3OnOffBlue").css("float", 'left'); // shift blue button left
			$('#centerRow3OnOffBlue').attr('value', 'on');
			$("#countBoxText").text('');

			// reset all values //
			myApp.initializeVars(); 
			$("#strictCircleSmall").css("background-color", 'black');
		}
	},
	startFunc: function(value) { // start button
		console.log('startFunc');
		if (value === 'start' && myApp.onOffVar === 'on') { // the game has to be on
			myApp.game.flashExclaimFunc('--'); // will flash this to start game
		}
	},
	strictFunc: function(value) { // toggle strick button
		console.log('strictFunc');
		if (value === 'strict' && myApp.onOffVar === 'on') { // game has to be on
			myApp.strictVar = myApp.strictVar * -1; // toggle between true (1) and false (-1)
			if (myApp.strictVar === 1) {
				$("#strictCircleSmall").css("background-color", 'green');
			}
			else {
				$("#strictCircleSmall").css("background-color", 'black');
			}
		}
	},
	gameClockFunc: function() {
		console.log('gameClockFunc');
		console.log('myApp.gameClockAction ', myApp.gameClockAction); // game clock needs to be toggeled go
		var count = 0;
		var timevar = setInterval(function() {
			console.log('count ', count);
			count++;
			if (count === 25 && myApp.gameClockAction === 'go') { // user has 25 secs to make all selections
				console.log('gameClockFunc 15');
				clearInterval(timevar);
				myApp.userTurn = false;
				// checks for match win
				myApp.game.checkForMatchWinFunc();
			}
			if (myApp.gameClockAction === 'stop') {
				console.log('gameClockFunc stop');
				clearInterval(timevar);
			}
		}, 1000);
	},
	flashExclaimFunc: function(flashVar) { 
		console.log('flashExclaimFunc');
		$("#countBoxText").text(flashVar);
		var f = document.getElementById('countBoxText');
		var count = 6;
		var timevar = setInterval(function() { // flash -- or !! 3 times
			f.style.display = (f.style.display == 'none' ? '' : 'none');
			count--;
			if (count === 0) {
				clearInterval(timevar);
				myApp.game.currentCountFunc();
			}
		}, 500);
	},
	currentCountFunc: function() {
		console.log('currentCountFunc');
		console.log('JSON.stringify(myApp.compSelection ****): ', JSON.stringify(myApp.compSelection));
		console.log('myApp.currentCount ', myApp.currentCount);
		if (myApp.currentCount === 0) { // current count is zero add 1 to count
			console.log('current count is 0!');
			myApp.game.addNewCompSelectionFunc();
		}
		else if (myApp.currentCount < 10) { // display count will show two digits
			console.log('less than 10');
			$("#countBoxText").text('0'+ myApp.currentCount); // adding leading zero
			myApp.game.flashCompChoicesFunc();
		}
		else {
			console.log('greater than 10');
			$("#countBoxText").text(myApp.currentCount);
			myApp.game.flashCompChoicesFunc();
		}
	},
	flashCompChoicesFunc: function() {
		console.log('flashCompChoicesFunc');
		var count = 0;
		var timevar = setInterval(function() { // flashing each computer choice for 1.5 seconds
			if (count < myApp.compSelection.length) {
				$('.doughnut' + myApp.compSelection[count]).fadeOut(500).fadeIn(500);
			}
			count++;
			if (count === myApp.compSelection.length) {
				clearInterval(timevar);
				myApp.userTurn = true; // user can now make a selection
				myApp.gameClockAction = 'go'; // the timer is now running 
				myApp.game.gameClockFunc();
			}
		}, 1500);
	},
	addNewCompSelectionFunc: function() {
		if (myApp.newCompSelection) { // add a new selection toggel true
			console.log('addNewCompSelectionFunc');

			myApp.compSelection.push(Math.floor(Math.random() * 4)+1); // each of the colors is represented by a number between 1 and 4. selection added to comp choice
			myApp.currentCount++; // game counter increased
			myApp.newCompSelection = false; // comp wont make a new choice unless count is 0 or user matches comp choices
			myApp.game.currentCountFunc(); // gui displays current count
		}
	},
	userSelectionFunc: function(value, atrib) { // user will click one of the colors
		if (atrib === 'donut' && myApp.userTurn === true) { // needs to go some where else
			console.log('userSelectionFunc');
			
			if (myApp.userSelection.length !== myApp.compSelection.length) {
				console.log('userSelectionFunc push');

				myApp.userSelection.push(parseInt(value)); // converting number representation of clicked color to a integer
				console.log('JSON.stringify(myApp.compSelection)***:', JSON.stringify(myApp.compSelection));
				console.log('JSON.stringify(myApp.userSelection)', JSON.stringify(myApp.userSelection));
			}
			if (myApp.userSelection.length === myApp.compSelection.length) { // user selected same amount as comp	
				myApp.userTurn = false;
				myApp.gameClockAction = 'stop'; // game clock stopped
				myApp.game.checkForMatchWinFunc();
			}
		}
	},
	checkForMatchWinFunc: function() {
		console.log('checkForMatchWinFunc');
		if (JSON.stringify(myApp.userSelection) === JSON.stringify(myApp.compSelection)) { // comparing user choices vs comp choices
			myApp.userSelection = []; // user selection reset
			myApp.newCompSelection = true; // computer can make a new choice and game count increased
			myApp.game.addNewCompSelectionFunc();
		}
		else { // no match 
			if (myApp.strictVar === -1) { // not strict
				myApp.userSelection = []; // user selection reset
				myApp.newCompSelection = false; // currnet count stays the same
				myApp.gameClockAction = 'stop'; // game clock stopped
				myApp.game.flashExclaimFunc('!!');
				
			}
			else { // strict
				myApp.userSelection = []; // user selection reset
				myApp.compSelection = []; // comp selection reset
				myApp.currentCount = 0; // game count reset to zero
				myApp.newCompSelection = true; // want to increase current count because meets the condition of game count = 0
				myApp.gameClockAction = 'stop'; // game clock stopped
				myApp.game.flashExclaimFunc('!!');
			}
		}
	}

};
/* Game logic end*/

/*=========================
     Initialize game
=========================*/
$(document).ready(function() {  
  myApp.initializeGame();
});
/* Initialize game end*/
