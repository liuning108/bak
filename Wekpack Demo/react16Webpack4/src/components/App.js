import  React, {Component} from  'react'
import '../css/App.sass';
import myson2Jpg from '../images/myson2.jpg'
import {Route,NavLink,Switch} from 'react-router-dom';
import ajaxComponent from '../hocs/ajaxComponent.js'
import Index from './Index.js'
import TimelineMaxApp from  './posts/TimelineMaxApp.js'
class App extends Component{
   render(){
        return (
            <Switch>
               <Route path="/"  component={Index}/>
            </Switch>
       )
   }
}
export  default App;
