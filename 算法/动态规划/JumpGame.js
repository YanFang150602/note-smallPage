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
  handler([1, 2,0,4]); // 6

  process.exit();
});

const handler = (arr) => {
  const f = [];
  f[0] = true; // 第一块石头可以到达
  for (let i = 1; i < arr.length; i++) { // i 表示要到达的石头
    for (let j = 0; j < i; j++) { // j表示已判断是否可以到达的石头
      f[i] = f[j] && j+arr[j]>=i;
    }
  }
  console.log(f[arr.length-1]);
}
