process.stdin.resume();
process.stdin.setEncoding('utf-8');


const input = [];
process.stdin.on('data', data => {
  input.push(data.trim());
  setTimeout(() => {
    process.stdin.emit('end');
  }, 10000);
});

process.stdin.on('end', () => {
  const f = new Array(28).fill(999);
  f[2] = 1;
  f[4] = 2;
  f[5] = 1;
  f[6] = 3;
  f[7] = 1;
  for (let i = 8; i <= 27; i++) {
    f[i] = Math.min(f[i-2] + 1, f[i-5] + 1, f[i-7] + 1);
  }

  console.log(f[27]);

  process.exit();
});
