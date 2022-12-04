var http = require('http');
var fs = require('fs');
http
  .createServer(function (req, res) {
    fs.readFile('../_data/day-one-data.txt', function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    });
  })
  .listen(8080);

const file = '../_data/day-one-data.txt';

fs.readFile(file, function (err, data) {
  if (err) throw err;

  // read in text file, split on double line breaks.
  //each grouping of values represents one elf's inventory
  const elves = data.toString().split('\n\n');

  // DAY ONE: Counting Calories
  // Find the Elf carrying the most Calories. How many total Calories is that Elf carrying?

  // loop through each elf's backpack
  // reduce each array to total up the caloric value of each item in the backpack

  // create a sum function
  const sumFunc = function (a, b) {
    return parseInt(a) + parseInt(b);
  };

  let totals = [];
  elves.forEach((d, i) => {
    let sum = d.split('\n').reduce(sumFunc);
    totals.push(parseInt(sum));
  });

  // get max value
  let most_calories = Math.max(...totals);
  console.log('Part 1 answer: ' + most_calories); // 68467

  // Find the top three Elves carrying the most Calories. How many Calories are those Elves carrying in total?

  // sort the elves by most calories
  const sorted_totals = [...totals].sort((a, b) => b - a);

  // get the top three
  const top_3 = sorted_totals.splice(0, 3);

  // add them up
  const top_3_total = top_3.reduce(sumFunc);
  console.log('Part 2 answer: ' + top_3_total); // 203420
});
