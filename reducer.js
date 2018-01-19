var uuidv1 = require('uuid/v1');
const reducer = function(bus, state){
    bus.on('addItem', function(todoVal){
        console.log('atn')
        var todo = {};
        todo.id = uuidv1();
        todo.value = todoVal
        todo.status = 'pending';
        state.push(todo)
        bus.emit('update', state);
    });
    bus.on('checkOrUncheck', function(itemId){
        var updatedTodo = state.filter(function(item){
            return item.id === itemId;
        })[0]
        const itemIndex = getItemIndex(state, itemId)
        updatedTodo.status === 'done' ? updatedTodo.status = 'pending' : updatedTodo.status = 'done';
        state[itemIndex] = updatedTodo;
        bus.emit('update');
        // state = state.filter(function(item){
        //     return item.id !== id;
        // }).concat([updatedTodo]);
    })
}


const getItemIndex = function(state, id){
    return state.findIndex(function(item){
      return id === item.id;
    });
  }

export default reducer;