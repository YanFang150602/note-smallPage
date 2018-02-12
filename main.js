require.config({
    paths:{
        time:"./time",
        text:"./text",
        canvas:"./canvas"
    }
});

var timeObj = null;
var textObj = null;
var canvasObj = null;
var changeTimeTimer = null;

require(["time","text","canvas"],function(time,text,canvas){
    timeObj = time;
    textObj = text;
    canvasObj = canvas;
});

function changeContent(e){
    changeTimeTimer?clearInterval(changeTimeTimer):null;
    switch(e.target.value){
        case "Home":changeContentByHome();break;
        case "Time":changeContentByTime(timeObj);break;
        case "Text":changeContentByText(textObj);break;
        case "Canvas":changeContentByCanvas(canvasObj);break;
    }
}
function changeContentByHome(){
    var content = document.getElementById("content");
    content.innerHTML = "我是首页哦~";
}

function changeContentByCanvas(obj){
    var content = document.getElementById("content");
    content.innerHTML = "";
    var node=document.createElement("Canvas");
    node.id = obj.id;
    node.width = obj.width;
    node.height = obj.height;
    content.appendChild(node);
    
    var context = node.getContext("2d");
    context.beginPath();
    context.lineTo(30,30);
    context.lineTo(30,80);
    context.lineTo(60,80);
    context.closePath();
    context.fillStyle="#EDEDED";
    context.fill();
}

function changeContentByTime(obj){
    var content = document.getElementById("content");
    content.innerHTML = "";
    var node=document.createElement("LI");
    var textnode=document.createTextNode(obj.getNowDate());
    node.appendChild(textnode);
    content.appendChild(node);
    
    changeTimeTimer = setInterval(function(){
        content.innerHTML = "";
        var node=document.createElement("LI");
        var textnode=document.createTextNode(obj.getNowDate());
        node.appendChild(textnode);
        content.appendChild(node);
    },1000);
}

function changeContentByText(obj){
    var content = document.getElementById("content");
    content.innerHTML = "";
    var node=document.createElement("LI");
    var textnode=document.createTextNode(obj.name+" "+obj.description);
    node.appendChild(textnode);
    content.appendChild(node);
}
