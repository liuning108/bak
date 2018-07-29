import React,{Component} from 'react';
import { Route,Link,Switch} from 'react-router-dom';
import {connect}  from "react-redux"
import {TweenMax,Power2,TimelineLite} from "gsap/TweenMax";
import ajaxComponent from '../hocs/ajaxComponent.js'
import * as ACTIONTYPES from '../stores/actionTypes.js'
import  * as action from '../stores/actions/actions.js'
let Post = ajaxComponent(()=>{
  return import('./Post.js')
});

class Index extends Component{
   componentDidMount(){
      this.props.loadAction()
   }
  handleWheel = (e)=>{
    console.log(e.deltaY);
    TweenMax.to('.cards',0.8,{
      left:"+="+e.deltaY*2+'px'
    })
    e.preventDefault();
  }

  bgCss = (url)=>{
     return {
        backgroundImage: "url("+url+")",
        backgroundPosition: "center center",
        backgroundSize:"cover"
     }
  }
  render(){
     var  listCards=this.props.data.map((d,i)=>{
        var itemStyle = this.bgCss(d.cover);
        return (
             <div key={i} className="card">
                <div className="left">
                  <div className="cover" style={itemStyle}/>
                </div>
                <div className="right">
                  <h2>{d.name}</h2>
                  <h4>{d.type}</h4>
                  <p>{d.description}</p>
                  <Link to="/post/1">
                  <button className="look">查看</button>
                  </Link>
                </div>
             </div>

        )
     })
    return (
      <div id="app">
         <div className="apptitle">作品集{this.props.counter}</div>
         <div className="cardList" onWheel={this.handleWheel}>
           <div className="cards">
            {listCards}
           </div>
         </div>
         <Switch>
            <Route path="/post/:id"  exact component={Post}/>
         </Switch>
     </div>
     )
  }
}
const mapStateToProps = state =>{
   return{
     data: state.art.data,
     counter:state.ctr.counter
   }
}
const mapDispatchToProps = dispatch =>{
   return {
      onInc: ()=> {
        dispatch({type:"INC",value:10 })
      },
      loadAction:()=>{
        dispatch(action.LoadAction())
      }
   }
}
export default connect(mapStateToProps,mapDispatchToProps)(Index)
