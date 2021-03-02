process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', data => {
  input += data;
  setTimeout(() => {
    process.stdin.emit('end');
  }, 10000);
});

process.stdin.on('end', () => {
  const row = input.trim();
  const datas = row.split(' ');
  const hour = datas.splice([datas.length - 1], 1)[0];
  if (isNaN(hour)) {
    console.log(-1);
  } else {
    for (let minSpeed = 1; ;minSpeed++) {
      let totalHour = 0;
      let isError = false;
      for (let num of datas) {
        if (isNaN(num)) {
          isError = true;
          break;
        }
        num = Number(num);
        totalHour += Math.round(num / minSpeed);
      }
      if (totalHour <= hour) {
        console.log(minSpeed);
        break;
      }
      if (isError) {
        console.log(-1);
        break;
      }
    }
  }
  
  process.exit();
});
