// please define the JavaScript input here(you can also rewrite the input). 
// following is the default: 
process.stdin.resume();
process.stdin.setEncoding('utf-8');

/**
 * 15. A+B Problem Plus
 */

var input;
process.stdin.on('data', (data) => {
	input += data;
	setTimeout(()=>{
		process.stdin.emit('end');
	},5000);
});

process.stdin.on('end', () => {
  let inputArray = input.trim().split('\n');
  const lineDatas = inputArray.splice(1, inputArray.length - 1);
  // 输出的内容
  const output = [];
  // 数组索引
  let index = 0;
  for(let line of lineDatas) {
      index++;
	  // 获取两个加数
      let [a, b] = line.trim().split(' ');
	  // 两个加数之和
      let c = 0;
      if(Number.MAX_SAFE_INTEGER < a || Number.MAX_SAFE_INTEGER < b) {
		  // 数据过大，超过Number范围，通过数组，进行两数相加
          c = bigIntSum(a.split('').reverse(), b.split('').reverse());
      }
      else {
          c = parseInt(a) + parseInt(b);
      }
      output.push(`Case ${index}:\n${a} + ${b} = ${c}`);
  }
  // 将数组转换为字符串，直接输出
  console.log(output.join('\n\n'));
  process.exit();
});

/**
 * PARAM aList:[]
 * PARAM bList:[]
 * RETURN sums:[]
 */
const bigIntSum = function (aList, bList) {
	// 获取数据最大长度
	let maxLength = Math.max(aList.length, bList.length);
	// 存放数据之和
	const sums = [];
	// 进数
	let rad = 0;
	for (let i = 0; i < maxLength; i++) {
		let sum = 0;
		aList[i] ? sum += Number(aList[i]) : '';
		bList[i] ? sum += Number(bList[i]) : '';
		if (rad) {
            sum += rad;
			// 进数使用之后，重新赋值为0，避免一直累加
            rad = 0;
        }
		// 缝十进一
		if (sum >= 10) {
			// 进数赋值
			rad = Math.floor(sum / 10);
			// 留下个位数做和
			sum = sum % 10;
		}
		// 和存放数组中
		sums.push(sum);
	}
	// 进数还存在，则添加到数组中
	if (rad) {
		sums.push(rad);
	}
    return sums.reverse().join('');
}




process.on('exit', function (code) {
    console.log('退出\(^o^)/~');
});
