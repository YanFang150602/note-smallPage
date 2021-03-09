process.stdin.resume();
process.stdin.setEncoding('utf-8');

const input = [];
process.stdin.on('data', data => {
  input.push(data.trim());
  process.stdin.emit('end');
})

process.stdin.on('end',() => {
  let num = input[0];
  const output = [];
  for (let i = 2;i <=  Math.sqrt(num); i++) {
    while (num % i === 0) {
      num /= i;
      output.push(`${i} `);
    }
  }
  if (num > 1) {
    output.push(`${num} `);
  }
  console.log(`${output.join('')}`);
  process.exit();
});