process.stdin.resume();
process.stdin.setEncoding('utf-8');

/**
 * 24. The Simple Problem
 * S(a,k,n)=a+(k+a)+(2k+a)+…+(nk+a)
 *
 * 关键点：序列求和
 * 1+2+3+...+n = (n+1)*n/2
 */
let input = '';
process.stdin.on('data', (data) => {
    input += data;
    setTimeout(()=>{
		process.stdin.emit('end');
	},5000);
});

process.stdin.on('end', () => {
    let inputArray = input.split('\n');
    let [a, k, n] = inputArray[0].split(' ');
    a = parseInt(a);
    k = parseInt(k);
    n = parseInt(n);
    const S =  a*(n+1) + (n+1)*n*k/2;

    console.log(S);
    process.exit();
});
process.on('exit', function (code) {
    console.log('退出\(^o^)/~');
});
