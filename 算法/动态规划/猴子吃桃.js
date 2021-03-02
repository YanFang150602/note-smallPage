process.stdin.resume();
process.stdin.setEncoding('utf-8');

/**
 * 82. 猴子爬山
 * 每一次只能跳1步或跳3步，试问猴子通过这个阶梯有多少种不同的跳跃方式
 * dp[i] = dp[i-1] + dp[i-3]
 */

var input;
process.stdin.on('data', (data) => {
    input += data;
    setTimeout(()=>{
        process.stdin.emit('end');
    },5000);
});
process.stdin.on('end', () => {
    let inputArray = input.split('\n');
    const output = [];
    let dp = [];
    dp[0] = 0;
    dp[1] = 1;
    dp[2] = 1;
    dp[3] = 2;
    inputArray.forEach((N) => {
        for(let i = 4; i <= N; i++){
            dp[i] = dp[i-1] + dp[i-3];
        }
        output.push(dp[N]);
    })
    console.log(`${output.join('\n')}`);
    process.exit();
});


process.on('exit', function (code) {
    console.log('退出\(^o^)/~');
});
