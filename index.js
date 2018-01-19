var yo = require('yo-yo');
var uuidv1 = require('uuid/v1');
import EventEmitter from 'events';
//import reducer from './reducer';
const bus = new EventEmitter();

const reducer = function(bus){
  bus.on('addItem', function(todoVal){
      var todo = {};
      todo.id = uuidv1();
      todo.value = todoVal
      todo.status = 'pending';
      state = [...state, todo];
      console.log(state);
      bus.emit('update');
  });
  bus.on('checkOrUncheck', function(itemId){
      var updatedTodo = state.filter(function(item){
          return item.id === itemId;
      })[0]
      
      updatedTodo.status === 'done' ? updatedTodo.status = 'pending' : updatedTodo.status = 'done';
      state = state.filter(function(item){
          return item.id !== itemId;
      }).concat([updatedTodo]);
      bus.emit('update');
  })
}


const getItemIndex = function(state, id){
  return state.findIndex(function(item){
    return id === item.id;
  });
}

var state = [{id: uuidv1(),
  value: 'atun',
  status: 'pending'},{id: uuidv1(),
    value: 'atun2',
    status: 'done'}] // start empty 
var el = list(state, update, checkUncheckTodo)
 
bus.on('update', function(){
  var newList = list(state, addTodo, checkUncheckTodo)
  console.log(state);
  yo.update(el, newList)
});

reducer(bus);


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
update();
function update () {
  bus.emit('update');
}

function addTodo(ev) {
    var todoVal = document.getElementById("todoVal");
    bus.emit('addItem', todoVal.value)
    todoVal.value = "";
    console.table(state);
}


function checkUncheckTodo(ev) {
  var id = ev.target.parentNode.getAttribute('id')
  bus.emit('checkOrUncheck', id);
}

document.body.appendChild(el)
