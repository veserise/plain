const express = require('express')
const port = 3005
const app = express()

const cookieParser = require('cookie-parser')
const emailTransporter = require('./email')

const changepwdTokemap = {}  //纪录用户的邮箱
const users = [{
  name: 'a',
  pwd: 123,
  email: '1005281785@qq.com'
}]


app.use((req, res, next) => {
  res.set('Content-Type', 'text/html; charset=UTF-8')
  next()
})
app.use(express.static(__dirname + '/static'))
app.use(express.urlencoded({
  extended: true
}))

//将cookie的内容进行解密
app.use(cookieParser('my secret'))


app.get('/', (req, res, next) => {
  if (req.signedCookies.user) {
    res.send(`
      <div>
        <h2>欢迎来投票</h2>
        <a href="/create">创建投票</a>
        <a href="/logout">退出</a>
      </div>
    `)
  } else {
    res.send(`
      <div>
        <a href="/register">注册</a>
        <a href="/login">登陆</a>
      </div>
    `)
  }

})

//注册页面
app.route('/register')
  .get((req, res, next) => {
    res.send(`
      <form action="/register" method="post">
        <h1>注册</h1>
        用户名：<input type="text" name="name"><br>
        密 码：<input type="password" name="pwd"><br>
        邮 箱： <input type="text" name="email"><br>
        <button>提交</button>
      </form>
    `)
  })
  
  .post((req, res, next) => {
    var userInfo = req.body
    if (users.findIndex(it => it.name == userInfo.name) >= 0) {
      res.end(`
          用户被占用<span id ="showCount1">3</span>秒跳转
          <script>
          var cout = 3
          setInterval(()=>{
            document.querySelector('#showCount1').textContent = cout--
          }, 1000)
          setTimeout( ()=>{
            location.href = '/register'
          },3000)
        </script>
      `)
    } else {
      res.end(`
          注册成功<span id ="showCount2">3</span>秒跳转
          <script>
          var cout = 3
          setInterval(()=>{
            document.querySelector('#showCount2').textContent = cout--
          }, 1000)
          setTimeout( ()=>{
            location.href = '/login'
          },3000)
        </script>
      `)
      users.push(userInfo)
    }
  })

//登陆页面
app.route('/login')
  .get((req, res, next) => {
    res.send(`
    <form id="loginForm" action="/login" method="post">
      <h1>登陆</h1>
      用户名： <input type="text" name="name"/><br>
      密  码： <input type="password" name="pwd"/><br>
      <a href="/forgot">忘记密码</a>
      <button>登陆</button>
    </form>

    <script>
      loginForm.onsubmit = e => {
        e.preventDefault()
        var name = document.querySelector('[name="name"]').value
        var pwd = document.querySelector('[name="pwd"]').value

        var xhr = new XMLHttpRequest()
        xhr.open('POST', '/login')
        xhr.onload = () => {
          var data = JSON.parse(xhr.responseText)
          if (data.code == 0) {
            alert('登陆成功，页面跳转')
            location.href = '/'
          } else {
            alert('登陆失败')
          }
        }
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        xhr.send('name=' + name + '&pwd=' + pwd)
      }
    </script>
  `)
  })
  .post((req, res, next) => {
    var loginU = req.body
    if (users.findIndex(it => {
      return it.name == loginU.name && it.pwd == loginU.pwd
    }) >= 0) {
      //用户登陆，信息cookie,标记，进行加密
      res.cookie('user', loginU.name, {
        signed: true,
      })
      res.json({code: 0})
      return
      res.end(`
        修改成功，<span id ="showCount3">3</span>秒跳转
        <script>
          var cout = 3
          setInterval(()=>{
            document.querySelector('#showCount3').textContent = cout--
          }, 1000)
          setTimeout( ()=>{
            location.href = '/'
          },3000)
        </script>
      `)
    } else {
      res.json({code: -1})
    }
  })

app.get('/logout', (req, res, next) => {
  res.clearCookie('user')  //清楚当前用户标记
  res.redirect('/')  //跳回首页
})

//忘记密码
app.route('/forgot')
  .get((req, res, next) => {
    res.end(`
    <form action="/forgot" method="post">
      请输入邮箱；<input type="tetx" name="email"><br>
      <button>确定</button>
    </form>
    `)
  })
  .post((req, res, next) => {
    var email = req.body.email
    var user = req.body.user
    var pwd = req.body.pwd

    var token = Math.random().toString().slice(2)   //随机生成数
    changepwdTokemap[token] = email
    var link = `http://localhost:3005/change-pwd/${token}`

    emailTransporter.sendMail({
      from: '1005281785@qq.com',
      to: email,
      subject: '修改密码',
      html: `<a href="${link}"></a>`
    }, (err, info) => {
      if (err) {
        console.log(err)
      } else {
        console.log('send to email: ' + info)
      }
    })

    res.end('以向你的邮箱发送密码重置连接')
  })

//修改密码
app.route('/change-pwd/:token')
  .get((req, res, next) => {
    var token = req.params.token
    var user = users.find(it => it.email == changepwdTokemap[token])

    res.end(`
      此页面可以重置${user}的密码
      <form action="." method="post">
        <input type="password" name="pwd>
      </form>
    `)

  })
  .post((req, res, next) => {
    var token = req.params.token
    var user = users.find(it => it.email == changepwdTokemap[token])
    var pwd = req.body.pwd
    if (user) {
      user.pwd = pwd
      delete changepwdTokemap[token]
      res.end('密码修改成功')
      users[user].pwd = pwd
    } else {
      res.end('连接已失效')
    }
  })



// app.get('/create', (req, res, next) => {

// })
// app.get('/vote/:id', (req, res, next) => {

// })

app.listen(port, () => {
  console.log('listeneing to port:', port)
})