// please define the JavaScript input here(you can also rewrite the input).
// following is the default:
process.stdin.resume();
process.stdin.setEncoding('utf-8');

/**
 * 16. A-B Problem Plus
 */
let input = '';
process.stdin.on('data', (data) => {
    input += data;
    setTimeout(() => {
        process.stdin.emit('end');
    }, 5000);
});
process.stdin.on('end', () => {
    let inputArray = input.trim().split('\n');
    let lineDatas = inputArray.splice(1, inputArray.length - 1);
    let index = 0;
    const output = [];
    for (let line of lineDatas) {
        index++;
        let[a, b] = line.split(' ');
        let c = 0;
        
        if (Number.MAX_SAFE_INTEGER < a || Number.MAX_SAFE_INTEGER < b) {
            a = a.split('').reverse();
            b = b.split('').reverse();
            
            if (a.length > b.length) {
                c = bigIntSum(a, b);
            }
            else if (a.length < b.length) {
                c = '-' + bigIntSum(b, a);
            }
            else {
                c = a > b ? bigIntSum(a, b) : '-' + bigIntSum(b, a);
            }
        }
        else {
            c = Number(a) - Number(b);
        }
        
        output.push(`Case ${index}:\n${a} - ${b} = ${c}`);

    }
    
    console.log(output.join('\n\n'))
    process.exit();
});

const bigIntSum = function (maxList, minList) {
	const sums = [];
	let rad = 0;
    
	for (let i = 0; i < maxList.length; i++) {
		let sum = 0;

        // 如果上次相减时，存在借位，则减1
		if (rad) {
			maxList[i] = Number(maxList[i]) - 1;
            // 借位重新赋值，避免被减数一直被减
			rad = 0;
		}
        
        // 被减数小于减数
		if ((minList[i] || minList[i] == 0) && maxList[i] < minList[i]) {
            // 存在借位
			rad = 1;
            // 借位，被减数加10
			maxList[i] = Number(maxList[i]) + 10;
			sum = Number(maxList[i]) - Number(minList[i]);
		}
        else if (minList[i]) {
			sum = Number(maxList[i]) - Number(minList[i]); ;
		}
        // 减数不存在
        else if (maxList[i]) {
			sum = maxList[i];
		}

		sums.push(sum);
	}
    // 将高位的0移除
	let sumStr = sums.reverse().join('').replace(/^0*(\d+)$/, '$1');
	return sumStr;
}


process.on('exit', function (code) {
	console.log('退出\(^o^)/~');
});
