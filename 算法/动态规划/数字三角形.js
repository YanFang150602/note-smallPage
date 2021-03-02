process.stdin.resume();
process.stdin.setEncoding('utf-8');

/**
 * 给出一个数字三角形，从顶点出发每次向下或右下走一步直至最底层，将途径的数字相加，问得到的最大值。
 */
/* 
7
3 8
8 1 0
2 7 4 4
4 5 2 6 5
*/

const input = [];
process.stdin.on('data', data => {
  input.push(data.trim());
  setTimeout(() => {
    process.stdin.emit('end');
  }, 10000);
});

process.stdin.on('end', () => {
  const twos = [];
  const f = [];
  for (const row of input) {
    const items = row.split(' ');
    twos.push(items);
    f.push(new Array(items.length).fill(0));
  }

  f[0][0] = Number(twos[0][0]);
  for (let i = 1; i < twos.length; i++) {
    for (let j = 0; j < twos[i].length; j++) {
      if (j === 0) {
        f[i][j] = f[i-1][j] + Number(twos[i][j]);
      } else if (j === twos[i].length -1) {
        f[i][j] = f[i-1][j-1] + Number(twos[i][j]);
      }else {
        f[i][j] = Math.max(f[i-1][j], f[i-1][j-1]) + Number(twos[i][j]);
      }
    }
  }

  const n = input.length - 1;
  const output = Math.max(...f[n]);
  console.log(output);

  process.exit();
});
