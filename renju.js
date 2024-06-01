const fs = require("fs");
const { exit } = require("process");

clearResultsFile();
let testData = readTestFile();
const dataArray = getFormatedArray(testData);

dataArray.forEach((board) => {
  const res = getGameResults(board);
  console.log(res);
  const formattedResults = formatResults(res);
  writeResultsToFile(formattedResults);
});

function clearResultsFile() {
  fs.writeFileSync("results.txt", "");
}

function readTestFile() {
  return fs.readFileSync("test.txt").toString();
}

function getFormatedArray(testData) {
  const testCases = testData[0];
  if (testCases < 1 || testCases > 11) exit();

  testData = testData.slice(2, testData.length);

  const data = testData.split(/\n|\r/g).map(function (num) {
    return num.split(" ");
  });

  let dataArray = [];
  for (let i = 0; i < testCases; i++) {
    const singleSet = [];
    for (let j = i * 19; j < (i + 1) * 19; j++) {
      singleSet.push(data[j]);
    }
    if (data.at((i + 1) * 19)) {
      data.splice((i + 1) * 19, 1);
    }
    dataArray.push(singleSet);
  }

  return dataArray;
}

function getGameResults(board) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
  ];
  const n = board.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] !== "0") {
        const player = board[i][j];
        for (const [dx, dy] of directions) {
          let count = 1;
          let x = i + dx;
          let y = j + dy;

          while (x >= 0 && x < n && y >= 0 && y < n && board[x][y] === player) {
            count++;
            x += dx;
            y += dy;
          }
          x = i - dx;
          y = j - dy;

          while (x >= 0 && x < n && y >= 0 && y < n && board[x][y] === player) {
            count++;
            x -= dx;
            y -= dy;
          }

          if (count >= 5) {
            return { player: player, row: i + 1, col: j + 1 };
          }
        }
      }
    }
  }

  return { player: 0, row: 0, col: 0 };
}

function formatResults(results) {
  if (results.player === 0) return "0";

  let content = `${results.player}\n${results.row} ${results.col}\n`;
  return content;
}

function writeResultsToFile(content) {
  fs.appendFileSync("results.txt", content + `\n`);
}
