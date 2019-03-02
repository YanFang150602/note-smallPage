define(function(require,exports,module){
  let Spinning = require("./spinning");
  let spinning = new Spinning("#container");
  spinning.render();
  
  exports.doSomething = function(){
    console.log("let main.js run");
  }
});