import  React from  'react'
import  ReactDOM from  'react-dom'
import App from './components/App'
import { BrowserRouter } from 'react-router-dom';
import {createStore,combineReducers,applyMiddleware,compose} from 'redux'
import thunk  from 'redux-thunk'
import reducer  from './stores/reducer.js'
import resultStores  from './stores/resultStores.js'
import showreelReducers  from './stores/showreelReducers.js'

import { Provider } from  'react-redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;



const allReducer =combineReducers({
  ctr:reducer,
  res:resultStores,
  art:showreelReducers,
})
const logger = (store)=>{
  return (next)=>{
    return (action)=>{
        console.log('[Middleware Dispatching]',action)
        const result =next(action)
        console.log('[Middleware next state ]',store.getState())
        return result

    }
  }
}
const store =createStore(allReducer,composeEnhancers(applyMiddleware(logger,thunk)))
let HtmlContext =(prop)=>{

    return (
      <Provider store={store} >
      <BrowserRouter>
         <App/>
      </BrowserRouter>
      </Provider>
    )
}
ReactDOM.render(<HtmlContext/>,document.getElementById("root"))
