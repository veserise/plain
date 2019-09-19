/**
 * 创建minSweeper类
 * 选择关卡，默认为第一关卡，即 10 * 10
 * 地雷，设置地雷个数，及地雷存在位置
 * 根据关卡来定义二维数组，生成面板
 * 添加鼠标事件，左键点击，右键点击，中键点击，弹出框点击
 * 根据点击的位置，判断是否击中地雷等相关规则
 */


class mineSweeper {
  constructor(level = 1) {
    this.level = level
    this.ary = [10, 40, 99]  //地雷

    this.set(true)
    this.setSweeper() //地雷
    this.createTable() //创建面板
    this.initEvent()  //事件
  }

  set(flag = true) {
    this.count = 0  //标记地雷的个数
    this.sweep = 0 //纪录地雷个数
    this.sweepCpunt = 0  //纪录地雷总个数
    this.flag = 0  //旗子的个数
    this.first = true  //第一次点击

    if (flag == true) {
      this.size = this.setLevel(this.level)
      this.box = document.querySelector('.box')
      this.box.innerHTML = ''
      this.swp = document.querySelector('.swp')
      this.conf = document.querySelector('.confim')
      this.conf.style.display = 'none'
    }
    this.board = Array(this.size).fill('E').map(it => it = Array(this.size).fill('E'))
  }

  //设置关卡
  setLevel(level) {
    if (level == '1') return 9
    if (level == '2') return 16
  }

  //设置地雷
  setSweeper() {
    var size = this.ary[this.level - 1]
    for (var i = 0; i < size; i++) {
      var x = Math.random() * this.size | 0
      var y = Math.random() * this.size | 0

      while (this.board[x][y] == 'M') {
        x = Math.random() * this.size | 0
        y = Math.random() * this.size | 0
      }
      this.board[x][y] = 'M'
      this.sweep++
      this.sweepCpunt++
    }
    this.swp.innerHTML = this.sweep

  }
  //创建面板
  createTable() {
    this.table = document.createElement('table')
    this.board.map(row => {
      var tr = document.createElement('tr')
      row.map(it => {
        var td = document.createElement('td')
        td.innerHTML = it
        td.className = 'level' + this.level
        td.classList.add('fontnone')
        tr.appendChild(td)
      })
      this.table.appendChild(tr)
    })
    this.box.appendChild(this.table)
  }

  //执行操作
  init(x = 0, y = 0) {

    //判断是否还有方块可走
    var c = 0
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        var flag = this.board[i][j]
        if (flag.innerHTML != 'M' || flag.classList.contains('fontnone')) {
          c++
        }
      }
    }
    if (c == 0) {
      return this.board
    }

    //点击到地雷,所有地雷都显示，游戏结束
    if (this.board[x][y] == 'M') {
      this.board[x][y] = 'X'
      this.table.rows[x].children[y].innerHTML = 'X'
      for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
          if (this.board[i][j] == 'M') {
            this.board[i][j] = 'X'
            this.table.rows[i].children[j].innerHTML = 'X'
          }
        }
      }
      return this.board
    }

    //计算四周地雷的个数
    var count = 0
    for (var i = x - 1; i <= x + 1; i++) {
      for (var j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < this.size && j >= 0 && j < this.size) {
          if (this.board[i][j] == 'M') count++
        }
      }
    }

    //判断四周地雷的个数
    if (count != 0) {
      this.board[x][y] = '' + count
      this.table.rows[x].children[y].innerHTML = '' + count
    } else {
      this.board[x][y] = 'B'
      this.table.rows[x].children[y].innerHTML = 'B'

      for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          if (i >= 0 && i < this.size && j >= 0 && j < this.size) {
            if (this.board[i][j] == 'E') this.init(i, j)
          }
        }
      }
    }

    return this.board
  }

  //执行鼠标事件
  initEvent() {
    var c = 0
    this.box.addEventListener('mousedown', e => {

      var wid = this.table.rows[0].children[0].offsetWidth + 4
      var x = (e.pageX - this.box.offsetLeft) / wid | 0
      var y = (e.pageY - this.box.offsetTop) / wid | 0

      // 第一次点击,不能的是地雷
      var mc = ''
      if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
        mc = this.table.rows[y].children[x]
        if (this.first == true && mc.innerHTML == 'M') {
          this.board[y][x] = 'E'
          mc.innerHTML = 'E'
          this.first = false
          this.sweep--
          this.sweepCpunt--
        }
      }

      //中键
      if (e.buttons == 4) {
        this.first = false

        //数字
        if ((mc.innerHTML | 0) > 0) {

          //显示邻近未标志的方块
          for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {
              if (i >= 0 && i < this.size && j >= 0 && j < this.size) {
                var x = this.table.rows[j].children[i]
                //周围有地雷
                if (!x.classList.contains('flag') && x.innerHTML == 'M') {
                  this.table.rows[j].children[i].innerHTML = 'X'
                  for (var k = 0; k < this.size; k++) {
                    for (var m = 0; m < this.size; m++) {
                      if (this.board[k][m] == 'M') {
                        this.board[k][m] = 'X'
                        this.table.rows[k].children[m].innerHTML = 'X'
                      }
                    }
                  }
                  break
                }
                //
                if (this.flag == (mc.innerHTML | 0) && x.classList.contains('fontnone')) {
                  if (!(x.classList.contains('flag') && x.innerHTML == 'M')) {
                    this.init(j, i)
                  }
                }
              }
            }
          }
        }
      }

      //左键
      if (e.buttons == 1) {
        this.first = false

        if (mc != '' && !mc.classList.contains('flag') && !mc.classList.contains('question')) {
          this.init(y, x)
        }

      }

      //右键
      if (e.buttons == 2) {
        this.first = false

        //标记旗子,?,撤销旗子,?
        if (mc.innerHTML == '?') {
          mc.classList.remove('question')
          mc.innerHTML = this.board[y][x]
        } else {
          if (mc != '' && mc.classList.contains('flag')) {
            mc.classList.remove('flag')
            mc.innerHTML = '?'
            mc.classList.add('question')
            this.flag--
            if (this.board[y][x] == 'M') {
              this.sweep++
            }
          } else if (mc != '') {
            mc.classList.add('flag')
            this.flag++
            if (this.board[y][x] == 'M') {
              this.sweep--
            }
          }
        }

      }

      c = this.changeTable()  //返回地雷被选中的个数
      this.swp.innerHTML = this.sweep

      this.conf.style.display = 'none'
      if (c != 0 && c == this.sweepCpunt) {
        this.confim('游戏失败!')
      } else if (c == 0 && this.sweep == 0 && this.count == 0 && this.flag == this.sweepCpunt) {
        this.confim('恭喜成功!')   //弹出框
      }

      this.box.addEventListener('mouseup', e => {
        e.preventDefault()
      })
    })
  }

  //改变面板，主要是样式改变
  changeTable() {
    var c = 0
    this.count = 0
    for (var i = 0; i < this.table.rows.length; i++) {
      var row = this.table.rows[i].children
      for (var j = 0; j < row.length; j++) {
        var char = row[j].innerHTML
        if ((char | 0) > 0) {
          row[j].classList.remove('fontnone')
          var cls = 'numcolor' + (char | 0)
          row[j].classList.add(cls)

        } else if (char == 'X') {
          row[j].classList.remove('fontnone')
          row[j].classList.add('c1')
          c++
          if (row[j].classList.contains('flag')) {
            this.count++
          }
        } else if (char == 'B') {
          row[j].classList.remove('fontnone')
          row[j].classList.add('c2')
        }
      }
    }
    return c
  }

  //弹出框
  confim(text) {
    var close = document.querySelector('.close')
    this.conf.children[1].innerHTML = text
    this.conf.style.display = 'block'
  }

  toString() {
    return '' + this.board.map(row => row.map(it => it).join('  ')).join('\n')
  }
}
