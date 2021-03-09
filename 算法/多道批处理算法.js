process.stdin.resume();
process.stdin.setEncoding('utf-8');

const input = [];
process.stdin.on('data', data => {
  input.push(data.trim());
  setTimeout(() => {
    process.stdin.emit('end');
  }, 5000);
})

process.stdin.on('end',() => {
  const [m, n] = input[0].split(' ');
  let tasks = input[1].split(' ');
  tasks.sort((a, b) => Number(a) - Number(b));

  let work = [];
  let total = 0;
  for (let i = 0; i < n; i++) {
    const time = Number(tasks[i]);
    if (work.length < m) {
      work.push(time);
    }
    if (work.length === Number(m)) {
      const over = work.shift();
      total += over;
      work = work.map((item) => item - over);
    }
  }

  for (let last = 0 ;last < work.length;) {
    const over = work.shift();
    total += over;
    work = work.map((item) => item - over);
  }

  console.log(total);
  process.exit();
});

/*
3 5
8 4 3 1 10
*/
