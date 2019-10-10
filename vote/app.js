const port = 3005
const http = require('http')
const path = require('path')
const url = require('url')
const express = require('express')
const socketIo = require('socket.io')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dbPromise = require('./db')   //数据库
let db

const app = express()
const server = http.createServer(app)
const ioServer = socketIo(server)
const userRouter = require('./user')  //针对于用户

app.locals.pretty = true  //美化模板输出

ioServer.on('connection', socket => {
  var path = url.parse(socket.request.headers.referer).path
  socket.on('select room', roomid => {
    socket.join('/vote/' + roomid)
  })
})


/**
 * 中间件
 * 
 */

app.use((req, res, next) => {
  res.set('Content-Type', 'text/html; charset=UTF-8')
  next()
})
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('stylesheets', path.join(__dirname, 'stylesheets'))
app.set('stylesheets engine', 'css')
app.use(express.json())   //解析json请求体
app.use(express.static(__dirname + '/static'))


app.use(express.urlencoded({ extended: true })) //url编码
app.use('/upload', express.static(__dirname + '/upload'))
app.use(session({ secret: 'my secret', resave: false, cookie: { maxAge: 60000 } }))
app.use(cookieParser('my secret')) //将cookie的内容进行解密

//首页
app.get('/', async(req, res, next) => {
  if (req.signedCookies.userid) {
    var userid = req.signedCookies.userid
    var user =  await db.get('SELECT * FROM users WHERE id=?', userid)
    var img = await db.get('SELECT * FROM imgs WHERE id=?', user.avatarid)

    var users = await db.all('SELECT * FROM users')
    var imgs = await db.all('SELECT * FROM imgs')
    var votes = await db.all('SELECT * FROM votes')
    var options = await db.all('SELECT * FROM options')
    var voteups = await db.all('SELECT * FROM voteups')

    res.render('vote-index.pug', {
      img:img,
      imgs:imgs,
      user:user,
      users:users,
      votes:votes,
      voteups:voteups,
      options:options,
    })
  } else {
    res.render('login.pug',{})
  }

})


app.route('/create')
  .get(async (req, res, next) => {
    var user =  await db.get('SELECT * FROM users WHERE id=?', req.signedCookies.userid)
    var img = await db.get('SELECT * FROM imgs WHERE id=?', user.avatarid)
    res.render('create', {
      img:img,
      user:user,
    })
  })
  .post(async (req, res, next) => {

  })

//创建投票
app.post('/create-vote', async (req, res, next) => {
  var info = req.body
  var userid = req.signedCookies.userid

  var user = await db.run('INSERT INTO votes (title, desc ,userid, singleSelection, deadline, anonymouse) VALUES (?,?,?,?,?,?)',
    info.title, info.desc, userid, info.singleSelection, info.deadline, info.anonymouse
  )

  var vote = await db.get('SELECT * FROM votes ORDER BY id DESC LIMIT 1')

  await Promise.all(info.options.map(option => {
    return db.run('INSERT INTO options (content, voteid) VALUES (?,?)', option, vote.id)
  }))

  if( req.is('json')){
    res.json(vote)
  }else{
    res.redirect('/vote/' + vote.id)
  }
})

//投票页面
app.get('/vote/:id', async (req, res, next) => {
  var votePromise = db.get("SELECT * FROM votes WHERE id=?", req.params.id)
  var optionPromise = db.all("SELECT * FROM options WHERE voteid=?", req.params.id)
  var user =  await db.get('SELECT * FROM users WHERE id=?', req.signedCookies.userid)
  var img = await db.get('SELECT * FROM imgs WHERE id=?', user.avatarid)
  
  var vote = await votePromise
  var options = await optionPromise

  res.render('vote.pug', {
    img:img,
    user:user,
    vote: vote,
    options: options,
  })
})

//投票
app.post('/voteup', async (req, res, next) => {
  var userid = req.signedCookies.userid

  var body = req.body
  var voteid = body.voteid
  var optionid = body.optionid

  var voteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, voteid)

  if (voteupInfo) { //已经投过
    await db.run('UPDATE voteups SET optionid=? WHERE userid=? AND voteid=?',optionid, userid, voteid)
  } else {
    await db.run('INSERT INTO voteups (userid, optionid, voteid) VALUES (?,?,?)',userid, optionid, voteid)
  }
  
  ioServer.in(`/vote/${voteid}`).emit('new vote', {
    userid,
    voteid,
    optionid: optionid,
  })

  var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?',voteid)
  res.json(voteups)
})

//某个用户获取某个问题的投票信息
app.get('/voteup/:voteid/info', async (req, res, next) => {
  var userid = req.signedCookies.userid
  var voteid = req.params.voteid
  var userVoteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, voteid)

  if (userVoteupInfo) {
    var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', voteid)
    res.json(voteups)
  } else {
    res.json(null)
  }
})

//获取投票信息
app.get('/voteinfo/:id',async ( req,res, next) =>{
  let id = req.params.id
  var vote = await db.get('SELECT * FROM votes WHERE id=?', id)
  var options = await db.all('SELECT * FROM options WHERE voteid=?', id)
  var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', id)

  res.json({
    vote: vote,
    voteups: voteups,
    options: options,
  })
})

app.use('/', userRouter)

//数据库打开,服务器才进行操作
dbPromise.then(dbResolve => {
  db = dbResolve
  server.listen(port, () => {
    console.log('listeneing to port:', port)
  })
})
