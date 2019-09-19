 
 const nodemailer = require('nodemailer')

 //发邮件，用户打开邮件修改密码
 let transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '1005281785',
    pass: 'jjicsohrwtfobbgg'
  }
})

module.exports = transporter