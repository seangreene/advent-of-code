var http = require('http');
var fs = require('fs');
http
  .createServer(function (req, res) {
    fs.readFile('../_data/day-one-data.txt', function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    });
  })
  .listen(8080);

const file = '../_data/day-two-data.txt';

fs.readFile(file, function (err, data) {
  if (err) throw err;

  // read in text file, split on double line breaks.
  //each grouping of values represents one elf's inventory
  const raw = data.toString().split('\n');

  // DAY TWO: Rock Paper Scissors
  // What would your total score be if everything goes exactly according to your strategy guide?

  // parse the strategy guide data

  // function to parse letters into rock, paper or scissors

  // A = Rock, B = Paper, C = Scissors
  // X = Rock, Y = Paper, Z = Scissors

  function parseLetter(l) {
    if (l == 'A' || l == 'X') {
      return 'rock';
    } else if (l == 'B' || l == 'Y') {
      return 'paper';
    } else if (l == 'C' || l == 'Z') {
      return 'scissors';
    } else {
      return 'farts';
    }
  }

  // split ABC from XYZ
  // build object with players (elf/me) and choices(ABC/XYZ)
  const strategyGuide = raw.map((d) => {
    let players = d.split(' ');
    let obj = {
      elf: { choice: parseLetter(players[0]), score: 0 },
      me: { choice: parseLetter(players[1]), score: 0 },
    };
    return obj;
  });

  //Your total score is the sum of your scores for each round. The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).

  // Rock = 1, Paper = 2, Scissors = 3
  // Loss = 0, Draw = 3, Win = 6

  function findWinner(game) {
    let elf = game['elf']['choice'];
    let me = game['me']['choice'];

    if (elf == 'rock' && me == 'paper') {
      return [0, 6];
    } else if (elf == 'paper' && me == 'scissors') {
      return [0, 6];
    } else if (elf == 'scissors' && me == 'rock') {
      return [0, 6];
    } else if (elf == me) {
      return [3, 3];
    } else {
      return [6, 0];
    }
  }

  const bonusPoints = {
    rock: 1,
    paper: 2,
    scissors: 3,
  };

  function rockPaperScissors(game) {
    let elfScore = game['elf']['score'];
    game['elf']['score'] =
      elfScore + findWinner(game)[0] + bonusPoints[game['elf']['choice']];

    let myScore = game['me']['score'];
    game['me']['score'] =
      myScore + findWinner(game)[1] + bonusPoints[game['me']['choice']];
  }

  // let the games begin
  strategyGuide.forEach((d) => {
    rockPaperScissors(d);
  });

  // calculate total scores for a player
  function tabulateScores(player) {
    let scores = strategyGuide
      .map((d) => {
        return d[player]['score'];
      })
      .reduce((acc, score) => {
        return acc + score;
      }, 0);
    return scores;
  }

  // and the winner is...
  let elfsFinalScore = tabulateScores('elf');
  let myFinalScore = tabulateScores('me');

  function crownWinner(a, b) {
    if (a > b) {
      return `Player 1 wins with ${a} points!`;
    } else {
      return `Player 2 wins with ${b} points!`;
    }
  }
  console.log(crownWinner(elfsFinalScore, myFinalScore));
});
