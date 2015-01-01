expressjs-blog
==============

#用expressjs开发的个人博客系统

###1.安装mongodb
###2.执行以下三条命令
    use blog
    db.addUser("root","1234")
    db.auth("root","1234");

###3.配置 common/config.js文件
    dbName 为 blog
    dbUser 为 root
    dbPass 为 1234

###4.执行
    npm install
    node server.js
