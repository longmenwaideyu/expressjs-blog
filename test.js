var cheerio = require('cheerio');
var $ = cheerio.load('<div><p>一行文字</p><img id = "img1" src="/a.jpg"/><img src="/b.jpg"/></div>');
var p = $('p').text();
var img = $('#img1').attr('src');
console.log(p);
console.log(img);

$('img').each(function (i, item) {
    var src = $(item).attr('src');
    console.log(src);
});
var abstract = '';
$('img').each(function (i, item) {
        if (i >= 3) return false;
        abstract += '<img src="' + item.attribs.src + '">';
        //这里不能使用
        //abstract += $(item).toString();
        //因为文章原有的img标签可能带有width，height，float等属性。影响摘要的排版
});
abstract += $.root().text().substr(0, 300)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/'/g, '&quot;') + '...';
console.log(abstract);

var spawn = require('child_process').spawn,
free = spawn('free', ['-m']);

// 捕获标准输出并将其打印到控制台
free.stdout.on('data', function (data) {
    console.log('标准输出：\n' + data);
});

// 捕获标准错误输出并将其打印到控制台
free.stderr.on('data', function (data) {
    console.log('标准错误输出：\n' + data);
});

// 注册子进程关闭事件
free.on('exit', function (code, signal) {
    console.log('子进程已退出，代码：' + code);
}); 