process.stdin.resume();
process.stdin.setEncoding('utf-8');


const input = [];
process.stdin.on('data', data => {
  input.push(data.trim());
  setTimeout(() => {
    process.stdin.emit('end');
  }, 5000);
});

process.stdin.on('end', () => {
  handler(3, 3); // 6

  process.exit();
});

const handler = (row, col) => {
  const f = [];
  for (let n = 0; n < row; n++) {
    f[n] = [];
    for (let m = 0; m < col; m++) {
      if (n === 0 || m === 0) {
        f[n][m] = 1;
      } else {
        f[n][m] = f[n-1][m] + f[n][m-1];
      }
    }
  }
  console.log(f[row -1 ][col-1]);
}
