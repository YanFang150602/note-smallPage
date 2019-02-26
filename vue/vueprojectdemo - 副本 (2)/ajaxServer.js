var fs = require("fs"),
    path = require('path'),
    querystring = require("querystring");
var userPath = process.cwd();

// 将本服务运行目录下的json文件的路径\文件名放在该数组下
var localJsonArr = [];

// 读取文件
function readJSONContent(pathname){
    var bin = fs.readFileSync(pathname);
    console.log("fs.readFileSync("+pathname+"):\n"+bin);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }
 
    return bin.toString('utf-8');
 
}

/*
fs.readFile("D:/work/08 mapping/menuList.json","utf8",function (error,data){
    if(error) throw error ;
    content = data;
});
*/

/*获取ebt data执行目录下的所有json文件路径： str*/
function readLocalJsons(userPath){
    var dirs=fs.readdirSync(userPath);
    dirs.forEach(function (dir){
        if(fs.statSync(path.join(userPath, dir)).isFile()){
            localJsonArr.push(path.join(userPath, dir))
        }else{
            readLocalJsons(path.join(userPath, dir))
        }
    });
}

/*通过请求的json地址从 本地json文件集合 中 获取到匹配的文件路径：str + str = str*/
function findLocalJsonByRequestURL(localJsons, requrestJsonUrl) {
    var filteredArr = localJsons.filter(function (localJson) {
        return path.basename(localJson) == requrestJsonUrl;
    });
    return filteredArr.length > 0 ? filteredArr[0] : "";
};

var http = require('http');
var server = http.createServer();
server.on('request',function(request,response){
    console.log(request.url);
    var reqUrl = querystring.unescape(request.url);
    
    if(reqUrl.indexOf("index.html")>=0){
        response.writeHead(200);
        response.write("Index.html");
        response.end();
        return;
    }
    if(reqUrl.indexOf("in3dex.html")>=0){
        response.writeHead(200);
        response.write("In3dex.html");
        response.end();
        return;
    }
    if(reqUrl.indexOf(".html")>=0){
        console.log(path.join(userPath,reqUrl));
        fs.readFile(path.join(userPath,reqUrl),"utf8",function (error,data){
            console.log(error,data);
            if(error) {throw error} ;
            response.writeHead(200,{"Content-Type": "text/html"});
            response.write(data);
            response.end();
        });
        return;
    }
    var formattingRequestUrl = reqUrl.replace(/\//g, "").replace(/\?.*/g, "").replace(/\:/g, "");
    
    readLocalJsons(userPath);
    
    var expectJsonPath = findLocalJsonByRequestURL(localJsonArr, formattingRequestUrl+".json");
    /*
    response.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});//在返回头中写入内容类型
    if(expectJsonPath){
        var stream = fs.createReadStream(expectJsonPath, {flags: "r", encoding: null});//创建只读流用于返回
        stream.on("error", function (error) {
            console.log("stream error" + error);
            response.writeHead(404);
            response.end();
        });
        stream.pipe(response);//连接文件流和http返回流的管道,用于返回实际Web内容 
    }else{
         response.write(content);
         response.end();
    }
    */
    
    var content = expectJsonPath?readJSONContent(expectJsonPath):"";
    console.log("content = "+content);

    if(content){
        response.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});//在返回头中写入内容类型
        var json = JSON.parse(content);
        if(json["response"]){
            response.writeHead(json["response"]);
            json = json[json["response"]];
            if(json[request.method]){
                json = json[request.method];
            }
            response.write(JSON.stringify(json));
        }
        else{
            response.write(content);
        }
    }else{
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("ok");
    }
    
    response.end();
});
server.on("error", function (error) {
    console.log(error);
});
server.listen(18003);
console.log('Server is running at http://localhost:18003');
