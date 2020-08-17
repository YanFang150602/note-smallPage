process.stdin.resume();
process.stdin.setEncoding('utf-8');
let input = '';
process.stdin.on('data', (data) => {
    input += data;
    process.stdin.emit('end');
});
/**
 * 31.整数拆分
 * 4 = 4;
 * 4 = 3 + 1;
 * 4 = 2 + 2;
 * 4 = 2 + 1 + 1;
 * 4 = 1 + 1 + 1 + 1;
 * 所以上面的结果是 5 。
 */
process.stdin.on('end', () => {
    let inputArray = input.split('\n');
    
    for(let N of inputArray) {
        fun(N)
    }
    process.exit();
});

const fun = (N) => {
    if(parseInt(N)){
        const arr = [];
        for(let i = 0; i <= N; i++){
            arr[i] = {};
            for(let j = 0; j <= N; j++){
                if(j === 0 ) {
                    arr[i][j] = 0;
                }
                else if(j === 1) {
                    arr[i][j] = 1;
                }
                else if(j === i) {
                    arr[i][j] = 1 + arr[i][j-1];
                }
                else if(i < j) {
                    arr[i][j] = arr[i][i];
                }
                else {
                    arr[i][j] = arr[i - j][j] + arr[i][j - 1];
                }
            }
        }
        console.log(arr[N][N]);
    }
    
}
process.on('exit', function (code) {
    console.log('退出\(^o^)/~');
});
