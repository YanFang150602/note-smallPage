process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', data => {
  const input = data.trim().split('\n');
  const output = [];
  for (let data of input) {
    output.push(Number(data.trim()).toString());
  }
  console.log(`${output.join('\n')}`);
  process.stdin.emit('end');
})

process.stdin.on('end',() => {
    process.exit();
});