var config = {
    blogName: '龙门外的鱼·博客',
    headPicture: '/images/bg.png',
    aPageNum: 10,//分页,一页显示多少文章.
    dbUser: 'root',//如果填写''，则数据库和博客必须放在同一台机器上
    dbPass: 'xxx',
    dbAddress: '182.192.0.0',
	dbPort: '27017',
    dbName: 'blog',
    ownerName: '龙门外的鱼',
    ownerLocation: '北京',
    ownerOccupation: '学生',
    ownerSkill: 'c++，算法，高性能计算',
    motto: '《孙子兵法》云：“求其上，得其中；求其中，得其下；求其下，必败。”  自己再菜，也不敢不求其上。',
    email: 'longmenwaideyu@126.com',
    serverPlatform: {//此项是百度云存储相关，百度云存储已经下线，请统一填写'local'
        platform: 'local',
        AccessKey: 'xxxxAdGlhYkMA1khQ1jq',
        SecrectKey: 'xxxWmRWjDwTIWudSMxof',
        buckect: ''
    },
    mailConfig: {//回复的邮件提醒服务
        service: 'Yahoo',//Gmail QQ QQex Yahoo Hotmail
        auth: {
            user: 'long@yahoo.com',
            pass: 'xxx'
        }
    },
    friendlyLinks: [
        { url: 'http://longmenwaideyu.com', name: '龙门外的鱼' },
        { url: 'http://longmenwaideyu.com', name: '龙门外的鱼' }
    ],
    ICPNumber: '京ICP备00000000号'
}
module.exports = config;
