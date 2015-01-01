var fs = require('fs');
var files = [
    'routes',
    'routes/blog',
    'routes/collect',
    'common',
    'models',
    'app.js',
    'useRoutes.js'
];//被监视的文件列表
var stamps = {};//被监视文件的时间戳
var change = [];
var child = null;
function startServer() {
    var spawn = require('child_process').spawn;
    child = spawn('node', ['./bin/www']);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    child.stderr.on('data', function (data) {
        console.log(data.toString());
    });
    child.on('exit', function (code) {
        console.log('子进程已关闭');
        child = startServer();
    });
    child.on('error', function(code, signal){
        child.kill(signal);
    });
    return child;
}
startServer();
///*
setInterval(function () {
    change = [];
    for (var i = files.length - 1; i >= 0; i--) {
        var stat = fs.statSync(files[i]);//读取文件信息
        var t = + new Date(stat.mtime);//mtime是修改时间
        if (stamps[files[i]] && t > stamps[files[i]]) {
            change.push(files[i]);
        }
        stamps[files[i]] = t;
    }
    if (change.length) {
        console.log("重启");
        child.kill();
    }
}, 2000);
//*/