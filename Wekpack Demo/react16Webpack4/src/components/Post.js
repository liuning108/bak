import React, {Component} from 'react';
import ajaxComponent from '../hocs/ajaxComponent.js'

class Post extends Component {
  state = {
    context: null
  }
  componentDidMount() {
    this.loadComponent();
  }
  loadComponent = () => {
    let InnerComponent = ajaxComponent(() => {
      return import ('./Posts.js')
    });
    this.setState({context: <InnerComponent/>})
  }
  close = () => {
    this.props.history.replace("/");
  }
  render() {

    return (<div className="control">
      <div className="panel">
        <div class="title">My Post Title</div>
        <div className="close" onClick={this.close}>X</div>
        <div className="panel-body">
          {this.state.context}
        </div>
      </div>
    </div>)
  }
}
export default Post
