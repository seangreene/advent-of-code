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

  // DAY ONE

  // read in text file, split on double line breaks.
  //each grouping of values represents one elf's inventory
  const elves = data.toString().split('\n\n');

  // loop through each elf's backpack
  // reduce each array to total up the caloric value of each item in the backpack
  let totals = [];
  elves.forEach((d, i) => {
    let sum = d.split('\n').reduce(function (a, b) {
      return parseInt(a) + parseInt(b);
    });
    totals.push(parseInt(sum));
  });

  // get max value
  let most_calories = Math.max(...totals);
  console.log(most_calories);
});
