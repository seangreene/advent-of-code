var http = require('http');
var fs = require('fs');
http
  .createServer(function (req, res) {
    fs.readFile('../_data/day-one-data.txt', function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    });
  })
  .listen(8080);

const file = '../_data/day-four-data.txt';

fs.readFile(file, function (err, data) {
  if (err) throw err;

  // read in text file, split on double line breaks.
  //each grouping of values represents one elf's inventory
  const raw = data.toString().split('\n');
  // console.log(raw)

  // DAY FOUR: Camp Cleanup
  // In how many assignment pairs does one range fully contain the other?

  const assignments = raw
    .map((d) => {
      return d.split(',', 2);
    })
    .map((d) => {
      let start = d[0].split('-', 2);
      let end = d[1].split('-', 2);
      return [start, end];
    });

  // [ [ '17', '43' ], [ '43', '43' ] ]
  // if one start value is greater than/equal, and the end value is less than/equal
  // then that range is fully contained in the other
  function range(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  }

  function containedTest(a) {
    let A = parseInt(a[0][0]);
    let B = parseInt(a[0][1]);
    let C = parseInt(a[1][0]);
    let D = parseInt(a[1][1]);

    if ((A <= C && D <= B) || (C <= A && B <= D)) {
      return 1;
    } else {
      return 0;
    }
  }

  let containedAssignments = 0;
  assignments.forEach((d) => {
    containedAssignments += containedTest(d);
  });

  //console.log(overlappingAssignments); //413

  function overlapTest(a) {
    //A-B,C-D
    //5-7,7-9
    let A = parseInt(a[0][0]);
    let B = parseInt(a[0][1]);
    let C = parseInt(a[1][0]);
    let D = parseInt(a[1][1]);

    if ((B <= C || A <= D) && (C <= B || D <= A)) {
      return 1;
    } else {
      return 0;
    }
  }

  // In how many assignment pairs do the ranges overlap?

  let overlappingAssignments = 0;
  assignments.forEach((d) => {
    overlappingAssignments += overlapTest(d);
  });

  console.log(overlappingAssignments); //806
});
