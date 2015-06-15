expressjs-blog(初步定名为FishBlog)
==============

##用expressjs开发的个人博客系统
###主要功能和特色
1. 文集功能，将文章整理成册
2. 功能齐全的富文本编辑器，写博客更随心
3. 响应式布局，手机上效果也很出色
4. 搜索引擎优化，自动提取文章大纲和关键词，填入description和keywords
5. 占内存少，方便托管于bae的128m最小web服务上
6. 漂亮的侧边栏，博主信息，标签，文集，文章大纲等
7. 文章大纲根据文章的标题自动提取
8. 自定义URL，博客链接可以体现主题

###待开发功能
1. 文章大纲自动添加锚点进行定位
2. 增加markdown的编辑器
3. 回复审核和删除功能的完善
4. seo优化目前只是雏形，继续深入开发。
5. 文章所在文集下的上一篇和下一篇文章

###1.安装mongodb和node
    sudo apt-get install mongo
    #node安装请自行百度
###2.执行以下四条命令
    mongo
    use blog
    db.addUser("root","1234")
    db.auth("root","1234");

###3.配置 common/config.js文件
    dbName 为 blog
    dbUser 为 root
    dbPass 为 1234
    dbAddress 为 mongodb所在机器IP
注mongodb默认不能远程连接，如果需要远程连接，要更改mongo的配置。如果在本机连接，dbUser, dbPass不要填。
###4.执行
    npm install
    node server.js
###5.到 /register 下注册
注册成功之后注释掉useRoutes.js的63-66行。
###6.到 /admin 下管理博客
##作者个人博客
[longmenwaideyu.com](http://longmenwaideyu.com)
