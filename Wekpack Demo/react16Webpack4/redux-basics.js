const redux = require('redux');
const createStore= redux.createStore;
const initState={
   counter : 0
}
// Reducer

const rootReduce = (state = initState,action)=>{
  switch (action.type) {
    case "INC":
      return  {
         ...state,
         counter: state.counter+1
      }
      break;
    case "ADD":
      return  {
         ...state,
         counter: state.counter+action.value
      }
      break;
    default:
  }
  return state;
}

//Store
const store =createStore(rootReduce)
// console.log("init",store.getState());


// Subscription
store.subscribe(()=>{
   console.log("[Subscription]",store.getState());
})


// Dispatchig Action
store.dispatch({
   type:"INC",
});

store.dispatch({
   type:"ADD",
   value: 10
});
// console.log("dispatch",store.getState())
