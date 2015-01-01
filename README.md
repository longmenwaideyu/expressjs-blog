expressjs-blog
==============

#用expressjs开发的个人博客系统

首先安装mongodb
然后执行以下三条命令
use blog
db.addUser("root","1234")
db.auth("root","1234");

然后配置 common/config.js文件

dbName 为 blog
dbUser 为 root
dbPass 为 1234

然后执行
node server.js
