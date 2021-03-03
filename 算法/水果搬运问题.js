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
  const n = Number(input.splice(0, 1)[0]);

  const firuts = [];
  const data = {};

  for (let row of input) {
    const [firut, id, veg] = row.split(' ');
    if (!firuts.includes(firut)) {
      firuts.push(firut);
    }

    if (!data[firut]) {
      data[firut] = [];
    }

    if (!data[firut][Number(veg)]) {
      data[firut][Number(veg)] = [];
    }

    data[firut][Number(veg)].push(Number(id));
    data[firut][Number(veg)].sort((a, b) => a - b);
  }
  const output = [];
  for (const firut of firuts) {
    for (let i = 0; i < data[firut].length; i++) {
      if (data[firut][i]) {
        for (const veg of data[firut][i]) {
          output.push(`${firut} ${veg} ${i}`);
        }
      }
      
    }
  }

  console.log(output.join('\n'));

  process.exit();
});

/*
5
Apple 1 80
Apple 2 62
Apple 4 73
Orange 4 65
Orange 1 90
Apple 3 91
Orange 3 88
Orange 5 90
*/
