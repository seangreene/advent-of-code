var http = require('http');
var fs = require('fs');
http
  .createServer(function (req, res) {
    fs.readFile('../_data/day-one-data.txt', function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    });
  })
  .listen(8080);

const file = '../_data/day-five-data.txt';

fs.readFile(file, function (err, data) {
  if (err) throw err;

  // read in text file, split on double line breaks.
  //each grouping of values represents one elf's inventory
  const raw = data.toString().split('\n');
  // console.log(raw)

  // DAY FIVE: Supply Stacks
});
