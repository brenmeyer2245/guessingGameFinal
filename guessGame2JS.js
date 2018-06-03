//Guess Game JS
console.log("Ready");
var guessLimit = 3;

function Game() {
    this.pastGuesses = [];
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
}

function startGame() {
    return new Game();
}


function generateWinningNumber() {
    return Math.ceil(Math.random() * 100);
}


function shuffle(arr) {
    var limit = arr.length - 1;
    while (limit) {
        var randNum = Math.floor(Math.random() * limit--);
        var temp = arr[randNum];
        arr[randNum] = arr[limit];
        arr[limit] = temp;

    }
    return arr;
}

Game.prototype.playerSubmission = function (myGuess) {
    if (myGuess < 0 || myGuess > 100 || isNaN(myGuess)) throw "Invalid Guess"
    else this.playersGuess = myGuess;

    return this.checkGuess()
}

Game.prototype.difference = function () {
    return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.checkGuess = function () {
    if (this.pastGuesses.length >= guessLimit) {
        console.log(this.pastGuesses, guessLimit);
        throw "You are out of guesses";
    }
    if (this.playersGuess === this.winningNumber) {
        $('#subtitle').html('Press Reset to play again');
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
        return "You Win!";
    }
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) return "You have already guessed that number";
    else {
        console.log(this.pastGuesses.length);
        //update guesses list items 
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);


        if (this.pastGuesses.length >= guessLimit) {
            $('#subtitle').html('Press Reset to play again');
            
            return "You Lose!";
        } else {

            var diff = this.difference();
            //Update subtitle based on conditional
            if (this.isLower) $('#subtitle').html('Guess Lower');
            else $('#subtitle').html('Guess Higher');
            //if close off
            if (diff < 10) return 'Soooooo close'
            //if medium off
            else if (diff < 25) return 'Not very close'
            //if way off 
            else return 'Waaaaaay Off!'
        }

    }

}

Game.prototype.isLower = function () {
    if (this.playersGuess < this.winningNumber) return true;
    else return false;
}

Game.prototype.giveHint = function () {
    var arr = [];
    arr[0] = Math.ceil(Math.random() * 100);
    arr[1] = Math.ceil(Math.random() * 100);
    arr[2] = this.winningNumber;

    return shuffle(arr);
}

function makeGuess(myGame) {
        var ans = parseInt($('#playerInput').val(), 10);
        $('#playerInput').val('');

        try {
            var result = myGame.playerSubmission(ans);
            console.log(result);
            //reflect output in title text
            $('#title').html(result);

        } catch (err) {
            console.log(err);
            $('#title').html(err);
        }
    
}

$(document).on('ready', function () {
    console.log("We're Ready");
    var game = startGame();;
    //when submit is clicked

    $('#submitBtn').on('click', function () {
        console.log($('#playerInput').val())
        makeGuess(game);
    });
    //when enter is pressed
    $('#playerInput').on('keypress', function (key) {
        if (key.which == 13) {
            console.log('Entered');
            makeGuess(game);
        }
    });
    $('#playerInput').on('mouseover', function () {
        $('#guess-list').slideUp();
    });
    $('#playerInput').on('mouseleave', function () {
        $('#guess-list').slideDown();
    });


    $('#reset').on('click', function () {
        game = startGame();
        //reset values
        $('#title').html('Welcome to the Game');
        $('#subtitle').html('The Game of your Life!');
        $('#guess-list li').html('-');
        $('#playerInput').html('');

    });

    $('#hint').on('click', function () {
        let hint = game.giveHint();
        $('#title').html(`The answer is either ${hint[0]}, ${hint[1]} or ${hint[2]}`);
        $('#title').effect('slide', 2000);
    });
});
