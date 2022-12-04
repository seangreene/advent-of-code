var http = require('http');
var fs = require('fs');
http
  .createServer(function (req, res) {
    fs.readFile('../_data/day-one-data.txt', function (err, data) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    });
  })
  .listen(8080);

const file = '../_data/day-three-data.txt';

fs.readFile(file, function (err, data) {
  if (err) throw err;

  // read in text file, split on double line breaks.
  //each grouping of values represents one elf's inventory
  const raw = data.toString().split('\n');

  // DAY THREE: Rucksack Reorganization

  // A given rucksack always has the same number of items in each of its two compartments, so the first half of the characters represent items in the first compartment, while the second half of the characters represent items in the second compartment.
  const rucksacks = raw.map((d) => {
    return d.split('', d.length);
  });

  const compartments = rucksacks.map((d) => {
    let l = d.length;
    let m = l / 2;

    c1 = d.slice(0, m);
    c2 = d.slice(m, l);

    return [c1, c2];
  });

  // Find common item in each compartment
  let commonItems = [];
  compartments.forEach((d) => {
    commonItems.push(d.reduce((p, c) => p.filter((e) => c.includes(e))));
  });

  // To help prioritize item rearrangement, every item type can be converted to a priority:

  // Lowercase item types a through z have priorities 1 through 26.
  // Uppercase item types A through Z have priorities 27 through 52.

  // test if char is upper case
  const isUpperCase = (string) => /^[A-Z]*$/.test(string);

  // condition ? if true do this : if false do this

  function priortizer(str) {
    return isUpperCase(str)
      ? str.toString().charCodeAt(0) - 38
      : str.toString().charCodeAt(0) - 96;
  }

  // What is the sum of the priorities of those item types?

  let prioritizedItems = commonItems
    .map((d) => {
      return priortizer(d[0]);
    })
    .reduce((i, d) => {
      return i + d;
    });

  // console.log(prioritizedItems) // 8298

  // Part Two
  //For safety, the Elves are divided into groups of three. Every Elf carries a badge that identifies their group. For efficiency, within each group of three Elves, the badge is the only item type carried by all three Elves. That is, if a group's badge is item type B, then all three Elves will have item type B somewhere in their rucksack, and at most two of the Elves will be carrying any other item type.

  // group the rucksacks data into groups of three elves

  function grouper(arr, chunkSize) {
    const res = [];
    while (arr.length > 0) {
      const chunk = arr.splice(0, chunkSize);
      res.push(chunk);
    }
    return res;
  }

  const groupedElves = grouper(rucksacks, 3);

  // Find the item type that corresponds to the badges of each three-Elf group. What is the sum of the priorities of those item types?

  let badgeTypes = [];
  groupedElves.forEach((d) => {
    badgeTypes.push(d.reduce((p, c) => p.filter((e) => c.includes(e))));
  });
  const badgesPrioritized = badgeTypes
    .map((d) => {
      return priortizer(d[0]);
    })
    .reduce((i, d) => {
      return i + d;
    });

  console.log(badgesPrioritized);
});
