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
  // X = Lose, Y = Draw, Z = Win

  function parseChoice(l) {
    if (l == 'A') {
      return 'rock';
    } else if (l == 'B') {
      return 'paper';
    } else if (l == 'C') {
      return 'scissors';
    } else {
      return 'farts';
    }
  }

  function parseResult(l) {
    if (l == 'X') {
      return 'lose';
    } else if (l == 'Y') {
      return 'draw';
    } else if (l == 'Z') {
      return 'win';
    } else {
      return 'farts';
    }
  }

  // parse input data
  const strategyGuide = raw.map((d) => {
    let round = d.split(' ');
    let obj = {
      elf_choice: parseChoice(round[0]),
      result_needed: parseResult(round[1]),
    };
    return obj;
  });

  // choose rock, paper or scissors based on the required result
  function makeChoice(r) {
    let e = r['elf_choice'];
    let o = r['result_needed'];

    let my_choice;

    if (o == 'win') {
      if (e == 'rock') {
        my_choice = 'paper';
      } else if (e == 'paper') {
        my_choice = 'scissors';
      } else if (e == 'scissors') {
        my_choice = 'rock';
      }
    } else if (o == 'lose') {
      if (e == 'rock') {
        my_choice = 'scissors';
      } else if (e == 'paper') {
        my_choice = 'rock';
      } else if (e == 'scissors') {
        my_choice = 'paper';
      }
    } else {
      my_choice = e;
    }
    return my_choice;
  }

  // let the game begin
  strategyGuide.map((d) => {
    d.my_choice = makeChoice(d);
  });

  //Your total score is the sum of your scores for each round. The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).

  // Points:
  // Rock = 1, Paper = 2, Scissors = 3
  // Loss = 0, Draw = 3, Win = 6
  const wdlPoints = {
    win: 6,
    draw: 3,
    lose: 0,
  };
  const bonusPoints = {
    rock: 1,
    paper: 2,
    scissors: 3,
  };

  // count points
  let myScore = 0;
  let elfScore = 0;

  strategyGuide.forEach((d, i) => {
    myScore += wdlPoints[d.result_needed] + bonusPoints[d.my_choice];

    if (d.result_needed == 'lose') {
      elfScore += 6 + bonusPoints[d.elf_choice];
    } else if (d.result_needed == 'draw') {
      elfScore += 0 + bonusPoints[d.elf_choice];
    } else {
      elfScore += bonusPoints[d.elf_choice];
    }
  });

  function crownWinner(a, b) {
    if (a > b) {
      return `I win, ${a} to ${b}! Yay!`;
    } else {
      return `Elf wins, ${a}-${b}. Boo!`;
    }
  }
  console.log(crownWinner(myScore, elfScore));
});
