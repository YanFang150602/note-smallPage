process.stdin.resume();
process.stdin.setEncoding('utf-8');

let input = '';
process.stdin.on('data', data => {
  input += data;
  setTimeout(() => {
    process.stdin.emit('end');
  }, 5000);
});

process.stdin.on('end', () => {
  const rows = input.trim().split('\r\n');
  rows.splice(0, 1);
  const twoArr = [];
  for (const row of rows) {
    twoArr.push(row.split(''));
  }
  let length = 1;
  let maxlen = 1;
  for (let i = 0; i < twoArr.length; i++) {
    length = 1;
    let cur = twoArr[i][0];
    for (let j = 0; j < twoArr[i].length;) {
      if (i+length >= twoArr.length || j+length >= twoArr[i].length) {
        break;
      }
      if (twoArr[i+length][j+length] !== cur) {
        j = j + length + 1;
        cur = twoArr[i][j];
        length = 1;
        continue;
      } else {
        const a = i + length;
        const b = j + length;
        length++;           // 对角相等 length + 1
        let isJuzhen = false;
        for (let k = length - 1; k > 0 ; k--) {
          if (twoArr[i+k][b] === cur && twoArr[a][j+k] === cur) {
            isJuzhen = true;
          } else {
            isJuzhen = false;
            j = j + length;
            cur = twoArr[i][j];
            length = 1;
            break;
          }
        }

        if (isJuzhen && length > maxlen) {
          maxlen = length;
        }
      }
    }
  }
  console.log(Math.pow(maxlen, 2));

  process.exit();
});
/*
3
11000001
11101000
00100001
00100001

 */
