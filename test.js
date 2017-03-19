var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport('SMTP', config);
/**
 * @param {String} subject：发送的主题
 * @param {String} html：发送的 html 内容
 */
function sendMail(subject, html) {
    var mailOptions = {
        from: 'longmenwaideyu@gmail.com',
        to: '842450138@qq.com',
        subject: subject,
        html: html
    };

    smtpTransport.sendMail(mailOptions, function(error, response){
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + response.message);
        }
        smtpTransport.close();
    });
};
var config = {
    service: 'Gmail',
    auth: {
        user: 'longmenwaideyu@gmail.com',
        pass: 'yy19910223'
    }
}
sendMail('测试发邮件', '<p>Hello world!</p>');
