//数据缓存
var todos = JSON.parse(localStorage.getItem('todos')) || [
  {
    done: true,
    content: 'eat',
  }, {
    done: false,
    content: 'drink',
  }, {
    done: false,
    content: 'sleep',
  }
]

var toggleAllFlag = true    //是否为全选
var completedFlag = 'All'   //当前状态
var inputCount = -1         //当前input为第几个
var todoAppEl = document.querySelector('#todo-app')

render()

//内容切换
function showing(todo, idx) {
  if (completedFlag === 'All') {
    return true
  }
  if (completedFlag === 'Active') {
    return !todo.done
  }
  if (completedFlag === 'Completed') {
    return todo.done
  }
}

//todo-app页面布局
function render() {
  localStorage.todos = JSON.stringify(todos)
  var countItems = 0

  var html = `<div>
        <h1>todos</h1>
        <input class='todo-input' placeholder = 'What needs to done ?'/>
       </div>
       <aside class="todo-box">
        <input type="checkbox" class='toggle-all' ${todos.every(todo => todo.done) ? 'checked' : ''}>
        <label class="togglelabel" for='toggle-all'> > </label>
        <ul class="todo-list">`

  todos.filter(showing).map((item, idx) => {
    html += `<li data-id="${idx}" class="${item.done == true ? "completed" : 'nocompleted'}">
        <input type="checkbox" class ='toggle' ${item.done ? "checked" : ''} />
        <label class="inputChange">${item.content}
        ${
      idx == inputCount ?
        `<input type="text" class="editput" style="display:block" value="${item.content}">
          </label>
          `
        : '</label><button class="destory"> &times; </button> '
      }
      </li>`
    countItems += item.done == false ? 1 : 0
  })

  html += `  </ul>
    </aside>`

  if (todos.length != 0) {
    html += `<footer class="footer">
        <span class='todo-count'>${countItems} item${countItems > 1 ? 's' : ''} left</span>
        <ul class='filters'>
          <li class="${completedFlag == 'All' ? 'selected' : 'noselected'}"><span class="all" name="complete">All</span></li>
          <li class="${completedFlag == 'Active' ? 'selected' : 'noselected'}"><span class="active" name="complete">Active</span></li>
          <li class="${completedFlag == 'Completed' ? 'selected' : 'noselected'}"><span class="completed" name="complete">Completed</span></li>
        </ul>
        ${ todos.some(todo => todo.done) ? `<button class='clear-Complt'>clear completed</button>` : ''} 
      </footer>`
  }

  todoAppEl.innerHTML = html
}

//键盘输入
todoAppEl.addEventListener('keyup', e => {

  var el = e.target
  if (el.matches('input.todo-input')) {
    if (e.keyCode == 13) {

      var todoText = el.value.trim()
      todos.push({
        done: false,
        content: todoText,
      })
      render()
      todoAppEl.querySelector('input.todo-input').focus()
    }
  }
  if (el.matches('input.editput')) {
    if (e.keyCode == 13) {   //回车
      todos[inputCount].content = el.value.trim()
      inputCount = -1
      render()

    } else if (e.keyCode == 27) { //esc
      inputCount = -1
      render()
    }
  }
})


//单击
todoAppEl.addEventListener('click', e => {

  var el = e.target

  //删除
  if (el.matches('button.destory')) {

    var idx = el.parentNode.dataset.id - 0
    todos.splice(idx, 1)
    render()
  }

  //打勾
  if (el.matches('input.toggle')) {

    var idx = el.parentNode.dataset.id - 0
    todos[idx].done = !todos[idx].done
    render()
  }

  //all
  if (el.matches('span.all')) {

    completedFlag = 'All'
    render()
  }

  //active
  if (el.matches('span.active')) {
    completedFlag = 'Active'
    render()
  }

  //completed
  if (el.matches('span.completed')) {
    completedFlag = 'Completed'
    render()
  }


  //全勾
  if (el.matches('label.togglelabel')) {
    todos.forEach(it => it.done = toggleAllFlag)
    toggleAllFlag = !toggleAllFlag
    render()
  }

  //清楚选中的
  if (el.matches('button.clear-Complt')) {
    todos = todos.filter(todo => !todo.done)
    render()
  }
})

//双击
todoAppEl.addEventListener('dblclick', e => {
  //
  if (e.target.matches('label.inputChange')) {
    inputCount = e.target.parentNode.dataset.id - 0
    render()
    var edit = todoAppEl.querySelector('.editput')
    edit.focus()
    edit.selectionStart = edit.selectionEnd = 99999999
  }
})

//失去焦点
todoAppEl.addEventListener('focusout', e => {

  var el = e.target
  if (el.matches('input.editput')) {
    if (inputCount == -1) return
    todos[inputCount].content = el.value.trim()
    inputCount = -1
    render()
  }
})