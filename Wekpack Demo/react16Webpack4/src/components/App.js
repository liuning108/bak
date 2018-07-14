import  React, {Component} from  'react'
import '../css/App.sass';
import myson2Jpg from '../images/myson2.jpg'
class App extends Component{
   render(){
       return (
           <div>
            <h1 className='A'>My React App Test</h1>
            <img id="myImage" src={myson2Jpg} width="107" height="98"/>
            <div class="container">
            <div class="row">
              <div class="col-sm">
                One of three columns
              </div>
              <div class="col-sm">
                One of three columns
              </div>
              <div class="col-sm">
                One of three columns
              </div>
            </div>
          </div>
           </div>
       )
   }
}
export  default App;
