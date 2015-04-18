function use (app) {
    var path = require('path');
    var ueditor = require('ueditor-nodejs');
    var routes = require('./routes/index');
    var login = require('./routes/login');
    var doLogin = require('./routes/doLogin');
    var blogNew = require('./routes/blog/new');
    var blogDoNew = require('./routes/blog/doNew');
    var article = require('./routes/blog/article');
    var reply = require('./routes/blog/reply');
    var collect = require('./routes/collect/collect');
    var tag = require('./routes/blog/tag');
    var collectEdit = require('./routes/collect/collectEdit');
    var getCollectDetail = require('./routes/collect/getCollectDetail');
    var collectDoEdit = require('./routes/collect/doEdit');
    var collectSingle = require('./routes/collect/collectSingle');
    var edit = require('./routes/blog/edit');
    var doEdit = require('./routes/blog/doEdit');
    var admin = require('./routes/admin');
    var dynamicPath = '';
    if (config.serverPlatform.platform == 'local') {
        dynamicPath = function (req) {
            if (req.session.isMe) {
                return '/uploadimage'
            } else {
                return '/visitorimage'
            }
        }
    } else {
        dynamicPath = config.serverPlatform.buckect;
    }
    app.use('/ueditor/ue', ueditor({
        configFile: '/ueditor/nodejs/config.json',
        mode: config.serverPlatform.platform,
        accessKey: config.serverPlatform.AccessKey,
        secrectKey: config.serverPlatform.SecrectKey,
        staticPath: path.join(__dirname, 'public'),
        dynamicPath: dynamicPath
    }));
    app.use('/', routes);
    app.use('/login', login);
    app.use('/doLogin', doLogin);
    app.use('/', blogNew);
    app.use('/', blogDoNew);
    app.use('/', article);
    app.use('/', reply);
    app.use('/', collect);
    app.use('/', tag);
    app.use('/', collectEdit);
    app.use('/', getCollectDetail);
    app.use('/', collectDoEdit);
    app.use('/', collectSingle);
    app.use('/', edit);
    app.use('/', doEdit);
    app.use('/', admin);
    var register = require('./routes/register');
    var doRegister = require('./routes/doRegister');
    app.use('/register', register);
    app.use('/doRegister', doRegister);
}
module.exports = use;
