class Snake{

  //Q代表苹果，< ^ > V为代表蛇
  constructor(width = 20, height = width){
    this.width = width
    this.height = height

    this.count = 0      //吃掉苹果的个数
    this.appleNumbers = 0  //苹果总个数为10

    this.bolad = Array(height).fill(0).map(it => Array(width).fill("."))
    this.time = Date.now()
    this.play = true

    this.generateApple()
    this.head = this.tail //= this.setsnakeHead()
  }

  //随机获得苹果
  generateApple(){
    var x = this.width * Math.random() | 0
    var y = this.height * Math.random() | 0

    if( this.bolad[y][x] != 'Q' && 
      this.bolad[y][x] != '>'  && 
      this.bolad[y][x] != '<'  && 
      this.bolad[y][x] != 'V'  && 
      this.bolad[y][x] != '^' &&
      x > 0 &&
      x < this.height-1 &&
      y > 0 &&
      y < this.width -1){
      this.bolad[y][x] = 'Q'
      return [y,x]

    }else{
      this.generateApple()
    }
  }

  //初始化苹果
  setappleCount(){

    while( this.appleNumbers < 10 ){
      var i = Math.random() * 10 | 0
      this.appleNumbers = this.appleNumbers + i
    }

    while( i > 0){
      this.generateApple()
      i--
    }
  }

  //蛇头
  setsnakeHead(){
    var x = ((this.width / 2) * Math.random() + this.width / 4 ) | 0
    var y = ((this.height / 2) * Math.random() + this.height /4 ) | 0

    if( this.bolad[y][x] == '.' ){
      this.bolad[y][x] = '>'
      return [x,y]

    }else{
      return this.setsnakeHead()
    }
  }

  //初始化蛇头
  setsnakeHeadPos(x, y){
    if( this.bolad[y][x] == '.' ){
      this.bolad[y][x] = '>'
      return [x,y]
    }else{
      return this.setsnakeHeadPos()
    }
  }

  //获取下一个位置的坐标
  getNextPos(x, y){
    var p = this.bolad[y][x]
    switch( p ){
      case 'A':
        if( y - 1 >= 0) return [x, y - 1]
        return false				
        break
      case 'V':
        if( y + 1 < this.width) return [x, y + 1]
        return false
        break
      case '<':
        if( x - 1 >= 0) return [x - 1, y]
        return false
        break
      case '>':
        if( x + 1 < this.height) return [x + 1, y]
        return false
        break
    }
  }

  //设置当前位置状态
  setPosFlag(x, y , staus){
    this.bolad[y][x] = staus
  }

  //获取当前位置的状态
  getPosFlag(x, y){
    return this.bolad[y][x]
  }

  //设置蛇头方向
  setHeadDirection(dir){
    var [x, y] = this.head
    var hfg = this.getPosFlag(x, y)
    if( dir == 'A' && hfg == 'V'){
      return
    }
    if( dir == 'v' && hfg == 'A'){
      return
    }
    if( dir == '<' && hfg == '>'){
      return
    }
    if( dir == '>' && hfg == '<'){
      return
    }
    this.bolad[y][x] = dir
  }

  next(){

    //获取头部
    var [hx, hy] = this.head

    //判断头部下一个位置是否可行
    if( this.getNextPos(hx,hy) ) var [hnx, hny] = this.getNextPos(hx,hy)
    else return false

    //获取尾部
    var [tx, ty] = this.tail

    if( this.getNextPos(tx, ty) ) var [tnx, tny] = this.getNextPos(tx, ty)
    else return false
    

    var hfg = this.getPosFlag(hx,hy) //head
    var hnfg = this.getPosFlag(hnx, hny) //head next

    if( hnfg == 'Q' ){  //遇到苹果
      this.count++
      this.appleNumbers--
      this.setPosFlag( hnx , hny, hfg)
      this.head = [hnx, hny]
      this.setappleCount()

      return true

    }else if( hnfg == '.'){   //走一步

      //先设置下一个位置的符号
      //纪录蛇的头和尾
      //去掉原尾巴位置的符号
      this.setPosFlag( hnx , hny, hfg)
      this.head = [hnx, hny]
      this.tail = [tnx, tny]
      this.setPosFlag(tx, ty, '.')
      return true

    }else{  //墙壁，蛇身

      return false
    }
  }

}
