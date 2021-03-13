process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', data => {
  // 1、输入处理
  // let input = data.trim(); // 单行输入
  // const input = data.trim().split(' '); // 单行输入，以空格分隔
  // const input = data.trim().split(','); // 单行输入，以逗号分隔
  // const input = data.trim().split('\n'); // 多行输入

  // 2、逻辑处理

  // 3、输出结果


  process.stdin.emit('end');
})

process.stdin.on('end',() => {
  process.exit();
});