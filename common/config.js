var config = {
    blogName: '个人博客',
    aPageNum: 10,//分页,一页显示多少文章.
    dbUser: 'root',
    dbPass: '1234',
    dbAddress: '111.111.111.111',
    dbName: 'blog',
    serverPlatform: {
        platform: 'local',
        AccessKey: 'xxx',//platform是local可以不填
        SecrectKey: 'xxx'//platform是local可以不填
    },
    ownerName: '龙门外的鱼',
    ownerLocation: '',//所在地
    ownerOccupation: '-',//职业
    ownerSkill: '',//主要从事领域与技能
    motto: 'Thoughts, stories and ideas.',//座右铭
    email: 'longmenwaideyu@126.com',
    otherBlog: {//你的其他博客
        url: 'http://hi.baidu.com/longmenwaideyu',
        name: '百度博客'
    },
    friendlyLinks: [//友情链接
        { url: 'http://hi.baidu.com/longmenwaideyu', name : '百度博客' }
    ],
    ICPNumber: '京ICP备00000000号'
}
module.exports = config;