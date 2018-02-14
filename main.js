/*=========================
     initialize game
=========================*/
var myApp = {
	initializeVars: function() {

	},
	initializeGame: function() {
		myApp.initializeVars();
		$(document).on('click', '.clickableButton', function() {

		});
	}
};
/* initialize game end*/

/*=========================
     Game logic
=========================*/
myApp.game = {
	
}
/* Game logic end*/


$(document).ready(function() {  
  myApp.initializeGame();
});