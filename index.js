var yo = require('yo-yo');
var uuidv1 = require('uuid/v1');

var state = [{id: uuidv1(),
  value: 'atun',
  status: 'pending'},{id: uuidv1(),
    value: 'atun2',
    status: 'done'}] // start empty 
var el = list(state, update, checkUncheckTodo)
 
function list (items, onclick, del) {
  return yo
  `<div>
    Todo
    <input id = todoVal type = 'text'/>
    <ul>
      ${state.filter(function(el){
          return el.status === 'pending';
      }).map(function(item){
        return yo`<li id = ${item.id}>${item.value}
        <input type = checkbox checked = false onclick = ${del}/>
        </li>`
      })}
    </ul>
    <button onclick=${onclick}>Add Todo</button>
    <h2>Done</h2>
    <ul>
      ${state.filter(function(el){
          return el.status === 'done'
      }).map(function(item){
        return yo`<li id = ${item.id}>${item.value}
        <input type = checkbox checked = true onclick = ${del}/>
        </li>`
        
      })}
  </div>`
}
 
function update (ev) {
  addTodo(ev)
  
  // construct a new list and efficiently diff+morph it into the one in the DOM 
  var newList = list(state, update, checkUncheckTodo)
  yo.update(el, newList)
}


function addTodo(ev) {
    var todoVal = document.getElementById("todoVal");
    var todo = {};
    todo.id = uuidv1();
    todo.value = todoVal.value;
    todo.status = 'pending';
    state = [
        ...state,
        todo
    ];

   
    todoVal.value = "";

    console.table(state);
}


  function checkUncheckTodo(ev) {
    var id = ev.target.parentNode.getAttribute('id')
    var updatedTodo = state.filter(function(item){
      return item.id === id;
    })[0]
    updatedTodo.status === 'done' ? updatedTodo.status = 'pending' : updatedTodo.status = 'done';
    state = state.filter(function(item){
      return item.id !== id;
    }).concat([updatedTodo]);
    var newList = list(state, update, checkUncheckTodo);
    yo.update(el, newList);
  }

  const getItemIndex = function(id){
    return state.findIndex(function(item){
      return id === item.id;
    });
  }


 
document.body.appendChild(el)
